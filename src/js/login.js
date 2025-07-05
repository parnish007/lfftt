// login.js
// Handles login logic for both customers and admin (SECURE VERSION)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (!form) {
    console.warn("⚠️ loginForm not found on this page.");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if (!phone || !password) {
      errorMsg.textContent = "Please enter both phone and password.";
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.role === "admin") {
          window.location.href = "/html/admin/dashboard.html";
        } else {
          window.location.href = "/html/index.html";
        }
      } else {
        errorMsg.textContent = data.message || "Login failed.";
      }
    } catch (err) {
      console.error("❌ Login request failed:", err);
      errorMsg.textContent = "Server error. Please try again later.";
    }
  });
});
