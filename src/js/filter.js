// filter.js
// Handles filtering tour or vehicle cards by keyword (title, location, price, etc.)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".tour-card, .vehicle-card");

  if (!searchInput || cards.length === 0) return;

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    cards.forEach(card => {
      const title = card.querySelector("h2, h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();

      const matches = title.includes(term) || desc.includes(term);
      card.style.display = matches ? "block" : "none";
    });
  });
});

