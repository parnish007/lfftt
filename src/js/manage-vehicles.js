document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vehicleForm");
  const vehicleList = document.getElementById("vehicleList");

  if (!form || !vehicleList) {
    console.warn("⚠️ vehicleForm or vehicleList not found on this page.");
    return;
  }

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
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Vehicle added!");
      form.reset();
      loadVehicles();
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert("❌ Failed to add vehicle.");
    }
  });

  // ✅ Load existing vehicles
  async function loadVehicles() {
    try {
      const res = await fetch("/api/vehicles");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const vehicles = await res.json();
      vehicleList.innerHTML = "";

      if (!Array.isArray(vehicles) || vehicles.length === 0) {
        vehicleList.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>No vehicles available.</p>";
        return;
      }

      vehicles.forEach(v => {
        const imageUrl = v.images && v.images.length > 0
          ? `/public/uploads/${v.images[0]}`
          : '/public/images/vehicles/default.jpg';

        const symbol = currencySymbols[v.currency] || '₨';

        const card = document.createElement("div");
        card.className = "vehicle-card";
        card.innerHTML = `
          <img src="${imageUrl}" alt="${v.name || 'Vehicle'}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;" />
          <h3>${v.name || 'N/A'}</h3>
          <p>Type: ${v.vehicleType || 'N/A'} | Seats: ${v.seatingCapacity || 'N/A'}</p>
          <p>From ${symbol} ${v.pricePerDay || 'N/A'}</p>
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

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Vehicle updated!");
      loadVehicles();
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
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Unknown error');
      }

      alert("✅ Vehicle deleted!");
      loadVehicles();
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("❌ Failed to delete vehicle.");
    }
  };

  loadVehicles();
});
