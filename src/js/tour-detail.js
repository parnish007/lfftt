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
    document.querySelector('.overview-text').innerHTML = tour.overview || 'No overview available';

    // Activities
    const activitiesList = document.querySelector('.activities-list');
    activitiesList.innerHTML = '';
    (tour.activities || []).forEach(act => {
      const li = document.createElement('li');
      li.textContent = act;
      activitiesList.appendChild(li);
    });

    // Images
    const slider = document.getElementById('slider');
    slider.innerHTML = "";
    if (tour.images && tour.images.length > 0) {
      tour.images.forEach(imgPath => {
        const img = document.createElement('img');
        img.src = imgPath.startsWith('/uploads') ? imgPath : `/uploads/${imgPath}`;
        img.alt = tour.name;
        slider.appendChild(img);
      });
    } else {
      const img = document.createElement('img');
      img.src = "/images/tours/default.jpg";
      img.alt = "Default Tour Image";
      slider.appendChild(img);
    }

    // Itinerary
    const itinerarySection = document.getElementById('itinerary-container');
    itinerarySection.innerHTML = "";
    if (tour.itineraryDays && tour.itineraryDays.length > 0) {
      tour.itineraryDays.forEach((day, i) => {
        const p = document.createElement('p');
        p.innerHTML = `<span class="day-title">Day ${i + 1}:</span> ${day}`;
        itinerarySection.appendChild(p);
      });
    } else {
      itinerarySection.innerHTML = "<p>No itinerary available.</p>";
      console.warn("⚠️ No itinerary data found for this tour.");
    }

    // Customize link
    document.getElementById('customize-link').href = `/tour/customize-tour.html?slug=${slug}`;

  } catch (err) {
    console.error("❌ Error loading tour:", err);
    document.querySelector('.overview-text').innerHTML = "Failed to load tour details.";
  }
});
