document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    console.error("❌ Missing slug in URL");
    document.querySelector('.tour-title').textContent = "Tour Not Found";
    return;
  }

  try {
    const res = await fetch(`/api/tours/${slug}`);
    if (!res.ok) throw new Error("Tour not found");
    const tour = await res.json();

    const symbols = { NPR: '₨', INR: '₹', USD: '$', EUR: '€', DKK: 'kr' };

    document.querySelector('.tour-title').textContent = tour.name || "Untitled Tour";
    document.querySelector('.tour-days').textContent = `Duration: ${tour.duration || 'N/A'} Days`;
    document.querySelector('.tour-duration').textContent = `${tour.duration || 'N/A'} Days`;
    document.querySelector('.accommodation').textContent = tour.accommodation || 'N/A';
    document.querySelector('.meals').textContent = tour.meals || 'N/A';
    document.querySelector('.price-value').textContent = tour.price || 'N/A';
    document.querySelector('.currency-symbol').textContent = symbols[tour.currency] || '₨';

    // ✅ Render overviewHTML with fallback
    const overviewText = document.querySelector('.overview-text');
    if (overviewText) {
      if (tour.overviewHTML && tour.overviewHTML.trim()) {
        overviewText.innerHTML = tour.overviewHTML;
      } else if (tour.overview && tour.overview.trim()) {
        overviewText.innerHTML = `<p>${tour.overview}</p>`;
      } else {
        overviewText.innerHTML = "<p>No overview available.</p>";
      }
    } else {
      console.warn("⚠️ .overview-text element not found in DOM.");
    }

    // ✅ Activities
    const activitiesList = document.querySelector('.activities-list');
    if (activitiesList) {
      activitiesList.innerHTML = '';
      (tour.activities || []).forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        activitiesList.appendChild(li);
      });
    }

    // ✅ Images (UPDATED for Cloudinary support)
    const slider = document.getElementById('slider');
    if (slider) {
      slider.innerHTML = "";
      if (tour.images && tour.images.length > 0) {
        tour.images.forEach(imgPath => {
          const cleanPath = imgPath.replace(/\\/g, '/');
          const isCloudinary = cleanPath.startsWith("http");
          const imageUrl = isCloudinary
            ? cleanPath
            : (cleanPath.startsWith('/uploads') ? cleanPath : `/uploads/${cleanPath}`);

          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = tour.name;
          slider.appendChild(img);
        });
      } else {
        const img = document.createElement('img');
        img.src = "/public/images/tours/default.jpg";
        img.alt = "Default Tour Image";
        slider.appendChild(img);
      }
    }

    // ✅ Itinerary
    const itinerarySection = document.getElementById('itinerary-container');
    if (itinerarySection) {
      itinerarySection.innerHTML = "";
      if (tour.itineraryDays && Array.isArray(tour.itineraryDays) && tour.itineraryDays.length > 0) {
        tour.itineraryDays.forEach((day, i) => {
          const p = document.createElement('p');
          p.innerHTML = `<span class="day-title">Day ${i + 1}:</span> ${day}`;
          itinerarySection.appendChild(p);
        });
      } else {
        console.warn("⚠️ No itineraryDays[] found in tour object:", tour);
        itinerarySection.innerHTML = "<p>No itinerary available.</p>";
      }
    }

    // ✅ Safe customize link setup
    const customizeLink = document.querySelector('.customize-btn') || document.getElementById('customize-link');
    if (customizeLink) {
      customizeLink.href = `/tour/customize-tour.html?slug=${slug}`;
    } else {
      console.warn("⚠️ Customize link not found.");
    }

  } catch (err) {
    console.error("❌ Error loading tour:", err);
    const overviewText = document.querySelector('.overview-text');
    if (overviewText) {
      overviewText.innerHTML = "Failed to load tour details.";
    }
  }
});
