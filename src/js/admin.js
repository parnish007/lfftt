(function checkAdminAuth() {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    alert("Access denied. Please login as admin.");
    window.location.href = "/html/login.html";
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
    window.location.href = "/html/login.html";
  };
  document.body.appendChild(logoutBtn);
};

document.addEventListener("DOMContentLoaded", async () => {
  createLogoutButton();

  const requestList = document.getElementById("requestList");
  if (!requestList) {
    console.error("❌ requestList container missing in HTML");
    return;
  }

  try {
    const res = await fetch("/api/customize");
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    
    const requests = await res.json();

    if (!Array.isArray(requests) || requests.length === 0) {
      requestList.innerHTML = "<p>No custom tour requests yet.</p>";
    } else {
      requestList.innerHTML = requests.map(req => `
        <div class="request-card">
          <h3>${req.name || 'Unnamed'} (${req.phone || 'N/A'})</h3>
          <p><strong>From:</strong> ${req.origin || 'N/A'} → <strong>To:</strong> ${req.destination || 'N/A'}</p>
          <p><strong>Budget:</strong> NPR ${req.budget || 'N/A'}</p>
          <p><strong>Days:</strong> ${req.days || 'N/A'}, <strong>Vehicle:</strong> ${req.vehicle || 'N/A'}</p>
          <p><strong>Message:</strong> ${req.message || 'No special requests'}</p>
          <p><strong>Status:</strong> ${req.status || 'Pending'}</p>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("❌ Failed to load requests:", err);
    requestList.innerHTML = "<p>Error loading requests. Check console.</p>";
  }
});
