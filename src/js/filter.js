// filter.js
// Handles filtering tour or vehicle cards by keyword (title, location, price, etc.)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".tour-card, .vehicle-card");

  if (!searchInput || cards.length === 0) {
    console.warn("⚠️ Search input or cards not found on this page.");
    return;
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const titleEl = card.querySelector("h2, h3");
      const descEl = card.querySelector("p");

      const title = titleEl ? titleEl.textContent.toLowerCase() : "";
      const desc = descEl ? descEl.textContent.toLowerCase() : "";

      const matches = title.includes(term) || desc.includes(term);
      card.style.display = matches ? "block" : "none";
    });
  });
});
