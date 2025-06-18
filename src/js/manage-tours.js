document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addTourForm");
  const tourList = document.getElementById("tourList");

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const activitiesInput = form.elements['activities'].value;
    const activities = activitiesInput
      ? activitiesInput.split(',').map(item => item.trim())
      : [];
    formData.set('activities', JSON.stringify(activities));

    try {
      const res = await fetch("/api/tours", { method: "POST", body: formData });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }
      alert("✅ Tour added!");
      form.reset();
      loadTours();
    } catch (err) {
      console.error("❌ Error adding tour:", err);
      alert("❌ Failed to add tour. See console for details.");
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

        const imageUrl = tour.images && tour.images.length > 0
          ? (tour.images[0].startsWith('/') ? tour.images[0] : `/uploads/${tour.images[0]}`)
          : "/public/images/tour-packages/default.jpg";

        const symbol = currencySymbols[tour.currency] || '₨';

        card.innerHTML = `
          <img src="${imageUrl}" alt="${tour.name || 'Tour'}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
          <h3>${tour.name || 'N/A'}</h3>
          <p>${tour.description || 'N/A'}</p>
          <p>Price: ${symbol} ${tour.price || 'N/A'}</p>
          <p>Duration: ${tour.duration || 'N/A'} days</p>
          <p>Accommodation: ${tour.accommodation || 'N/A'}</p>
          <p>Meals: ${tour.meals || 'N/A'}</p>
          <button onclick="editTour('${tour._id}')">Edit</button>
          <button onclick="deleteTour('${tour._id}')">Delete</button>
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
    const newPrice = prompt("Enter new price:");
    const newCurrency = prompt("Enter currency code (NPR, INR, USD, EUR, DKK):", "NPR");
    const newDescription = prompt("Enter new description:");
    const newDuration = prompt("Enter new duration (days):");
    const newAccommodation = prompt("Enter new accommodation:");
    const newMeals = prompt("Enter new meals:");
    const newActivities = prompt("Enter new activities (comma-separated):");
    const newOverview = prompt("Enter new overview:");

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
          price: Number(newPrice),
          currency: newCurrency || 'NPR',
          description: newDescription,
          duration: Number(newDuration),
          accommodation: newAccommodation,
          meals: newMeals,
          activities: newActivities ? newActivities.split(',').map(item => item.trim()) : [],
          overview: newOverview
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
      alert("❌ Failed to update tour. See console for details.");
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
      alert("❌ Failed to delete tour. See console for details.");
    }
  };

  loadTours();
});
