document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tourSlug = urlParams.get("slug");

  if (!tourSlug) {
    alert("❌ No tour slug found in URL.");
    return;
  }

  try {
    const response = await fetch(`/api/tours/${tourSlug}`);
    if (!response.ok) throw new Error("Tour not found");

    const tour = await response.json();

    document.querySelector(".tour-title").textContent = tour.name || "Untitled Tour";
    document.querySelector(".tour-days").textContent = `Duration: ${tour.duration || 'N/A'} Days`;
    document.querySelector(".overview").textContent = tour.overview || "No overview available.";
    document.querySelector(".price-usd").textContent = `NPR ${tour.price || '0'}`;
    document.querySelector(".accommodation").textContent = tour.accommodation || "Standard Hotel";
    document.querySelector(".meals").textContent = tour.meals || "Breakfast Included";

    const activitiesList = document.querySelector(".activities-list");
    activitiesList.innerHTML = "";
    if (tour.activities && tour.activities.length > 0) {
      tour.activities.forEach(activity => {
        const li = document.createElement("li");
        li.textContent = activity;
        activitiesList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No listed activities.";
      activitiesList.appendChild(li);
    }

    // ✅ Insert main image at top (if present)
    if (tour.images && tour.images.length > 0) {
      const firstImage = tour.images[0].startsWith('/uploads/')
        ? tour.images[0]
        : `/uploads/${tour.images[0]}`;

      const imageEl = document.createElement("img");
      imageEl.src = firstImage;
      imageEl.alt = tour.name;
      imageEl.style.width = "100%";
      imageEl.style.maxHeight = "400px";
      imageEl.style.objectFit = "cover";
      imageEl.style.borderRadius = "12px";
      imageEl.style.margin = "20px auto";
      imageEl.style.display = "block";

      const overviewSection = document.querySelector(".overview-section");
      overviewSection.parentNode.insertBefore(imageEl, overviewSection);
    }

  } catch (err) {
    console.error("❌ Failed to load tour details:", err);
    alert("Failed to load tour details. Please try again later.");
  }
});
