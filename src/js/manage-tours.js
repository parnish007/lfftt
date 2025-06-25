document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addTourForm");
  const tourList = document.getElementById("tourList");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");

  if (!form || !tourList) {
    console.warn("⚠️ addTourForm or tourList not found on this page.");
    return;
  }

  const currencySymbols = {
    'NPR': '₨',
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'DKK': 'kr'
  };

  form.images.addEventListener("change", (e) => {
    if (imagePreviewContainer) {
      imagePreviewContainer.innerHTML = "";
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = document.createElement("img");
          img.src = reader.result;
          img.style = "width: 90px; height: 70px; object-fit: cover; margin-right: 5px; border-radius: 6px;";
          imagePreviewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.set('activities', form.elements['activities'].value.trim());

    const overviewHTML = document.getElementById("overviewHTML")?.innerHTML || "";
    formData.append("overviewHTML", overviewHTML);

    const dayTextareas = document.querySelectorAll(".day-itinerary textarea");
    const itineraryDays = [];
    dayTextareas.forEach(day => itineraryDays.push(day.value.trim()));
    itineraryDays.forEach((val, idx) => formData.append("itineraryDays[]", val));

    try {
      const res = await fetch("/api/tours", { method: "POST", body: formData });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Tour added!");
      form.reset();
      if (imagePreviewContainer) imagePreviewContainer.innerHTML = "";
      loadTours();
    } catch (err) {
      console.error("❌ Error adding tour:", err);
      alert(`❌ Failed to add tour: ${err.message}`);
    }
  });

  async function loadTours() {
    try {
      const res = await fetch("/api/tours");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const tours = await res.json();
      tourList.innerHTML = "";

      if (!Array.isArray(tours) || tours.length === 0) {
        tourList.innerHTML = "<p>No tours available.</p>";
        return;
      }

      tours.forEach(tour => {
        const card = document.createElement("div");
        card.className = "tour-card";

        const imageUrl = (tour.images && tour.images.length > 0)
          ? tour.images[0]
          : "/public/images/tour-packages/default.jpg";

        const symbol = currencySymbols[tour.currency] || '₨';
        const shortDesc = tour.description
          ? (tour.description.length > 100 ? tour.description.slice(0, 100) + '...' : tour.description)
          : 'No description';

        card.innerHTML = `
          <img src="${imageUrl}" alt="${tour.name || 'Tour'}"
            style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h3>${tour.name || 'N/A'}</h3>
          <p>${shortDesc}</p>
          <p>Price: ${symbol} ${tour.price || 'N/A'}</p>
          <p>Duration: ${tour.duration || 'N/A'} days</p>
          <p>Accommodation: ${tour.accommodation || 'N/A'}</p>
          <p>Meals: ${tour.meals || 'N/A'}</p>
          <div>
            <button onclick="editTour('${tour._id}')">Edit</button>
            <button onclick="deleteTour('${tour._id}')">Delete</button>
          </div>
        `;
        tourList.appendChild(card);
      });
    } catch (err) {
      console.error("❌ Error loading tours:", err);
      tourList.innerHTML = "<p>Failed to load tours. Please try again later.</p>";
    }
  }

  window.editTour = async (id) => {
    const newName = prompt("Enter new tour name:");
    const newPrice = prompt("Enter new price (e.g. 5000 or Negotiable):");
    const newCurrency = prompt("Enter currency code (NPR, INR, USD, EUR, DKK):", "NPR");
    const newDescription = prompt("Enter new description:");
    const newDuration = prompt("Enter new duration (days):");
    const newAccommodation = prompt("Enter new accommodation:");
    const newMeals = prompt("Enter new meals:");
    const newActivities = prompt("Enter new activities (comma-separated):");
    const newOverview = prompt("Enter new overview:");
    const newOverviewHTML = prompt("Enter new overview (HTML supported):");
    const newItinerary = prompt("Enter itinerary (use || separator for days):");

    const itineraryDays = newItinerary ? newItinerary.split("||").map(d => d.trim()) : [];

    if (!newName || !newPrice || !newDescription) {
      alert("⚠ Update cancelled: Name, price, and description are required.");
      return;
    }

    try {
      const res = await fetch(`/api/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          price: newPrice, // ✅ Keep price as string
          currency: newCurrency || 'NPR',
          description: newDescription,
          duration: Number(newDuration),
          accommodation: newAccommodation,
          meals: newMeals,
          activities: newActivities ? newActivities.split(',').map(item => item.trim()) : [],
          overview: newOverview,
          overviewHTML: newOverviewHTML,
          itineraryDays
        })
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Tour updated!");
      loadTours();
    } catch (err) {
      console.error("❌ Error updating tour:", err);
      alert(`❌ Failed to update tour: ${err.message}`);
    }
  };

  window.deleteTour = async (id) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Tour deleted!");
      loadTours();
    } catch (err) {
      console.error("❌ Error deleting tour:", err);
      alert(`❌ Failed to delete tour: ${err.message}`);
    }
  };

  loadTours();
});
