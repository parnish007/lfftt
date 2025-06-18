document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tourSlug = urlParams.get("slug");

  if (!tourSlug) {
    alert("❌ No tour slug found in URL.");
    return;
  }

  try {
    const response = await fetch(`/api/tours/${tourSlug}`);
    if (!response.ok) throw new Error(`Tour not found (status ${response.status})`);

    const tour = await response.json();

    const titleEl = document.querySelector(".tour-title");
    const daysEl = document.querySelector(".tour-days");
    const overviewEl = document.querySelector(".overview");
    const priceEl = document.querySelector(".price-usd");
    const accommodationEl = document.querySelector(".accommodation");
    const mealsEl = document.querySelector(".meals");
    const activitiesList = document.querySelector(".activities-list");
    const overviewSection = document.querySelector(".overview-section");

    if (!titleEl || !daysEl || !overviewEl || !priceEl || !accommodationEl || !mealsEl || !activitiesList || !overviewSection) {
      console.warn("⚠️ One or more required elements are missing on this page.");
      return;
    }

    titleEl.textContent = tour.name || "Untitled Tour";
    daysEl.textContent = `Duration: ${tour.duration || 'N/A'} Days`;
    overviewEl.textContent = tour.overview || "No overview available.";
    priceEl.textContent = `NPR ${tour.price || '0'}`;
    accommodationEl.textContent = tour.accommodation || "Standard Hotel";
    mealsEl.textContent = tour.meals || "Breakfast Included";

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

    if (tour.images && tour.images.length > 0) {
      const firstImage = tour.images[0].startsWith('/uploads/')
        ? tour.images[0]
        : `/uploads/${tour.images[0]}`;

      const imageEl = document.createElement("img");
      imageEl.src = firstImage;
      imageEl.alt = tour.name || "Tour Image";
      imageEl.style.width = "100%";
      imageEl.style.maxHeight = "400px";
      imageEl.style.objectFit = "cover";
      imageEl.style.borderRadius = "12px";
      imageEl.style.margin = "20px auto";
      imageEl.style.display = "block";

      overviewSection.parentNode.insertBefore(imageEl, overviewSection);
    }

  } catch (err) {
    console.error("❌ Failed to load tour details:", err);
    alert("Failed to load tour details. Please try again later.");
  }
}); 
