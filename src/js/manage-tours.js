document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addTourForm");
  const tourList = document.getElementById("tourList");

  // ✅ Currency symbols map
  const currencySymbols = {
    'NPR': '₨',
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'DKK': 'kr'
  };

  // ✅ Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Convert activities to array
    const activitiesInput = form.elements['activities'].value;
    const activities = activitiesInput
      ? activitiesInput.split(',').map(item => item.trim())
      : [];

    formData.set('activities', JSON.stringify(activities));

    try {
      const res = await fetch("/api/tours", { method: "POST", body: formData });
      const result = await res.json();

      if (res.ok) {
        alert("✅ Tour added!");
        form.reset();
        loadTours();
      } else {
        alert(`❌ Failed to add tour: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error adding tour:", err);
      alert("❌ Failed to add tour. See console for details.");
    }
  });

  // ✅ Load tours and display them
  async function loadTours() {
    try {
      const res = await fetch("/api/tours");
      const tours = await res.json();

      tourList.innerHTML = "";

      if (tours.length === 0) {
        tourList.innerHTML = "<p>No tours available.</p>";
        return;
      }

      tours.forEach(tour => {
        const card = document.createElement("div");
        card.className = "tour-card";

        const imageUrl = tour.images && tour.images.length > 0
          ? (tour.images[0].startsWith('/') ? tour.images[0] : `/uploads/${tour.images[0]}`)
          : "/public/images/tour-packages/default.jpg";

        const symbol = currencySymbols[tour.currency] || '₨'; // default to NPR

        card.innerHTML = `
          <img src="${imageUrl}" alt="${tour.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" />
          <h3>${tour.name}</h3>
          <p>${tour.description}</p>
          <p>Price: ${symbol} ${tour.price}</p>
          <p>Duration: ${tour.duration} days</p>
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

  // ✅ Edit tour
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
          currency: newCurrency || 'NPR', // ✅ include currency update
          description: newDescription,
          duration: Number(newDuration),
          accommodation: newAccommodation,
          meals: newMeals,
          activities: newActivities.split(',').map(item => item.trim()),
          overview: newOverview
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Tour updated!");
        loadTours();
      } else {
        alert(`❌ Failed to update tour: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error updating tour:", err);
      alert("❌ Failed to update tour. See console for details.");
    }
  };

  // ✅ Delete tour
  window.deleteTour = async (id) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        alert("✅ Tour deleted!");
        loadTours();
      } else {
        alert(`❌ Failed to delete tour: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error deleting tour:", err);
      alert("❌ Failed to delete tour. See console for details.");
    }
  };

  loadTours();
});
