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
        card.innerHTML = `
          <h3>${user.name || 'N/A'}</h3>
          <p>Email: ${user.email || 'N/A'}</p>
          <p>Role: ${user.role || 'N/A'}</p>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        `;
        userList.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading users:", err);
      userList.innerHTML = "<p>Failed to load users. Please try again later.</p>";
    }
  }

  window.deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch("/api/users/" + id, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }
      alert("✅ User deleted.");
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("❌ Failed to delete user.");
    }
  };

  loadUsers();
});
