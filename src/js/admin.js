(function checkAdminAuth() {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    alert("Access denied. Please login as admin.");
    window.location.href = "../login.html";
  }
})();

const createLogoutButton = () => {
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.classList.add("btn");
  logoutBtn.style.position = "absolute";
  logoutBtn.style.top = "20px";
  logoutBtn.style.right = "30px";
  logoutBtn.onclick = () => {
    localStorage.removeItem("role");
    alert("Logged out successfully.");
    window.location.href = "../login.html";
  };
  document.body.appendChild(logoutBtn);
};

document.addEventListener("DOMContentLoaded", async () => {
  createLogoutButton();

  const requestList = document.getElementById("requestList");

  try {
    const res = await fetch("/api/customize");
    const requests = await res.json();

    if (requests.length === 0) {
      requestList.innerHTML = "<p>No custom tour requests yet.</p>";
    } else {
      requestList.innerHTML = requests.map(req => `
        <div class="request-card">
          <h3>${req.name} (${req.phone})</h3>
          <p><strong>From:</strong> ${req.origin} → <strong>To:</strong> ${req.destination}</p>
          <p><strong>Budget:</strong> NPR ${req.budget}</p>
          <p><strong>Days:</strong> ${req.days}, <strong>Vehicle:</strong> ${req.vehicle}</p>
          <p><strong>Message:</strong> ${req.message || 'No special requests'}</p>
          <p><strong>Status:</strong> ${req.status}</p>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("❌ Failed to load requests:", err);
    requestList.innerHTML = "<p>Error loading requests. Check console.</p>";
  }
});
