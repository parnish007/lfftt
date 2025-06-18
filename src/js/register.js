document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("registerError");

  if (!form) {
    console.warn("⚠️ registerForm not found on this page.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (name && email && phone && phone.length >= 10 && password && password.length >= 3) {
      localStorage.setItem("user", JSON.stringify({ name, email, phone }));
      localStorage.setItem("role", "customer");

      alert("✅ Registered successfully. Redirecting to homepage...");
      window.location.href = "/index.html";
    } else {
      const message = "❌ Please fill in all fields with valid details.";
      if (errorMsg) {
        errorMsg.textContent = message;
      } else {
        alert(message);
      }
    }
  });
});
