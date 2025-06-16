document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vehicleForm");
  const vehicleList = document.getElementById("vehicleList");

  // ✅ Currency symbol mapping
  const currencySymbols = {
    'NPR': '₨',
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'DKK': 'kr'
  };

  // ✅ Submit new vehicle
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      if (res.ok) {
        alert("✅ Vehicle added!");
        form.reset();
        loadVehicles();
      } else {
        alert(`❌ Failed to add vehicle: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert("❌ Failed to add vehicle.");
    }
  });

  // ✅ Load existing vehicles
  async function loadVehicles() {
    try {
      const res = await fetch("/api/vehicles");
      const vehicles = await res.json();
      vehicleList.innerHTML = "";

      if (vehicles.length === 0) {
        vehicleList.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>No vehicles available.</p>";
        return;
      }

      vehicles.forEach(v => {
        const imageUrl = v.images && v.images.length > 0
          ? `/public/uploads/${v.images[0]}`
          : '/public/images/vehicles/default.jpg';

        const symbol = currencySymbols[v.currency] || '₨'; // default to NPR

        const card = document.createElement("div");
        card.className = "vehicle-card";
        card.innerHTML = `
          <img src="${imageUrl}" alt="${v.name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;" />
          <h3>${v.name}</h3>
          <p>Type: ${v.vehicleType} | Seats: ${v.seatingCapacity}</p>
          <p>From ${symbol} ${v.pricePerDay}</p>
          <p>${v.description || 'No description'}</p>
          <button onclick="editVehicle('${v._id}')">✏ Edit</button>
          <button onclick="deleteVehicle('${v._id}')">🗑 Delete</button>
        `;
        vehicleList.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading vehicles:", err);
      vehicleList.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>Failed to load vehicles. Please try again later.</p>";
    }
  }

  // ✅ Edit a vehicle
  window.editVehicle = async (id) => {
    const newName = prompt("Enter new vehicle name:");
    const newPrice = prompt("Enter new price per day:");
    const newCurrency = prompt("Enter currency code (NPR, INR, USD, EUR, DKK):", "NPR");
    const newSeats = prompt("Enter new seating capacity:");
    const newDescription = prompt("Enter new description:");

    if (!newName || !newPrice || !newSeats || !newDescription) {
      alert("⚠ Update cancelled: all fields are required.");
      return;
    }

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          pricePerDay: Number(newPrice),
          currency: newCurrency || 'NPR',
          seatingCapacity: Number(newSeats),
          description: newDescription
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Vehicle updated!");
        loadVehicles();
      } else {
        alert(`❌ Failed to update vehicle: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
      alert("❌ Failed to update vehicle.");
    }
  };

  // ✅ Delete a vehicle
  window.deleteVehicle = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        alert("✅ Vehicle deleted!");
        loadVehicles();
      } else {
        alert(`❌ Failed to delete vehicle: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("❌ Failed to delete vehicle.");
    }
  };

  loadVehicles();
});
