document.addEventListener("DOMContentLoaded", () => {
  const userList = document.getElementById("userList");

  if (!userList) {
    console.warn("⚠️ userList not found on this page.");
    return;
  }

  async function loadUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const users = await res.json();
      userList.innerHTML = "";

      if (!Array.isArray(users) || users.length === 0) {
        userList.innerHTML = "<p>No users found.</p>";
        return;
      }

      users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.style.border = "1px solid #ddd";
        card.style.padding = "10px";
        card.style.marginBottom = "8px";
        card.style.borderRadius = "6px";
        card.style.backgroundColor = "#f9f9f9";

        card.innerHTML = `
          <h3>${user.name || 'N/A'}</h3>
          <p>Email: ${user.email || 'N/A'}</p>
          <p>Role: ${user.role || 'User'}</p>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        `;

        userList.appendChild(card);
      });
    } catch (err) {
      console.error("❌ Error loading users:", err);
      userList.innerHTML = "<p>Failed to load users. Please try again later.</p>";
    }
  }

  window.deleteUser = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        alert("✅ User deleted.");
        loadUsers();
      } else {
        alert(`❌ Failed to delete user: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("❌ Failed to delete user.");
    }
  };

  loadUsers();
});
