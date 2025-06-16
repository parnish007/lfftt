// login.js
// Handles login logic for both customers and admin

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    if (phone === "9847309013" && password === "Ratorani12@+") {
      // Admin login
      localStorage.setItem("role", "admin");
      localStorage.setItem("user", JSON.stringify({ name: "Admin", phone }));
      window.location.href = "admin/dashboard.html";
    } else if (phone && password.length >= 3) {
      // Customer login
      localStorage.setItem("role", "customer");
      localStorage.setItem("user", JSON.stringify({ name: "Customer", phone }));
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = "Invalid phone number or password.";
    }
  });
});

