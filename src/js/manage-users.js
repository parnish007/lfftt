document.addEventListener("DOMContentLoaded", () => {
  const userList = document.getElementById("userList");

  async function loadUsers() {
    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      userList.innerHTML = "";
      users.forEach(user => {
        const card = document.createElement("div");
        card.innerHTML = `
          <h3>${user.name}</h3>
          <p>Email: ${user.email}</p>
          <p>Role: ${user.role}</p>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        `;
        userList.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading users:", err);
    }
  }

  window.deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch("/api/users/" + id, { method: "DELETE" });
    loadUsers();
  };

  loadUsers();
});
