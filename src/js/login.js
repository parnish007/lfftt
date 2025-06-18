// login.js
// Handles login logic for both customers and admin

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (!form) {
    console.warn("⚠️ loginForm not found on this page.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if (!phone || !password) {
      errorMsg.textContent = "Please enter both phone and password.";
      return;
    }

    if (phone === "9847309013" && password === "Ratorani12@+") {
      // Admin login
      localStorage.setItem("role", "admin");
      localStorage.setItem("user", JSON.stringify({ name: "Admin", phone }));
      window.location.href = "/html/admin/dashboard.html"; // ✅ Use root-relative path for Render
    } else if (password.length >= 3) {
      // Customer login
      localStorage.setItem("role", "customer");
      localStorage.setItem("user", JSON.stringify({ name: "Customer", phone }));
      window.location.href = "/html/index.html"; // ✅ Use root-relative path for Render
    } else {
      errorMsg.textContent = "Invalid phone number or password.";
    }
  });
});
