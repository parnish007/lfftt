// main.js
// Global site-wide enhancements: navbar animation, role-based UI, etc.

document.addEventListener("DOMContentLoaded", () => {
  // Animate navbar logo text if exists
  const animatedTitle = document.querySelector(".navbar-left h1");
  if (animatedTitle) {
    animatedTitle.style.opacity = 0;
    animatedTitle.style.transform = "translateY(-20px)";
    setTimeout(() => {
      animatedTitle.style.transition = "all 1s ease";
      animatedTitle.style.opacity = 1;
      animatedTitle.style.transform = "translateY(0)";
    }, 300);
  }

  // Show/hide Login or Logout based on role
  const navbarLinks = document.querySelector(".navbar-links");
  if (navbarLinks) {
    const role = localStorage.getItem("role");
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.onclick = () => {
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      alert("You have been logged out.");
      window.location.href = "index.html";
    };

    if (role) {
      // Remove login if already logged in
      const loginBtn = navbarLinks.querySelector(".login-btn");
      if (loginBtn) loginBtn.remove();
      navbarLinks.appendChild(logoutLink);
    }
  }

  // Scroll animation for service cards
  const cards = document.querySelectorAll(".card");
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // run on page load
});

