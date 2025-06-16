document.addEventListener("DOMContentLoaded", () => {
  const bookingContainer = document.getElementById("bookingContainer");

  async function fetchAcceptedBookings() {
    try {
      const [tourRes, vehicleRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/vehicle-bookings")
      ]);

      const [tourData, vehicleData] = await Promise.all([
        tourRes.json(),
        vehicleRes.json()
      ]);

      const accepted = [
        ...tourData.filter(b => b.status === "Accepted"),
        ...vehicleData.filter(b => b.status === "Accepted")
      ];

      displayBookings(accepted);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      bookingContainer.innerHTML = "<p style='text-align:center;'>Failed to load accepted bookings.</p>";
    }
  }

  function displayBookings(bookings) {
    if (bookings.length === 0) {
      bookingContainer.innerHTML = "<p style='text-align:center;'>No accepted bookings to bill.</p>";
      return;
    }

    bookings.forEach(b => {
      const card = document.createElement("div");
      card.className = "booking-card";

      card.innerHTML = `
        <h3>${b.title}</h3>
        <p><strong>Name:</strong> ${b.name}</p>
        <p><strong>Email:</strong> ${b.email}</p>
        <p><strong>Phone:</strong> ${b.phone || 'N/A'}</p>
        <p><strong>Origin:</strong> ${b.origin || 'N/A'}</p>
        <p><strong>Destination:</strong> ${b.destination || 'N/A'}</p>
        <p><strong>Type:</strong> ${b.type || 'Tour / Vehicle'}</p>

        <div class="actions">
          <button class="btn default-bill" onclick="processDefaultBill('${b.name}', '${b.email}', '${b.title}')">Process Bill</button>
          <button class="btn custom-bill" onclick="redirectToCustomBill('${b.name}', '${b.email}', '${b.title}')">Custom Bill</button>
        </div>
      `;

      bookingContainer.appendChild(card);
    });
  }

  window.redirectToCustomBill = (name, email, title) => {
    const query = new URLSearchParams({
      customerName: name,
      customerEmail: email,
      packageName: title
    }).toString();

    window.location.href = `custom-bill.html?${query}`;
  };

  window.processDefaultBill = async (name, email, title) => {
    const currency = prompt("Enter currency (e.g., NPR, INR, USD, EUR, DKK):", "NPR");
    const amount = prompt("Enter final price (numeric):");

    if (!currency || !amount) {
      alert("❌ Bill not processed: both currency and price are required.");
      return;
    }

    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          packageName: title,
          amount,
          currency,
          description: "Thank you for booking with Life For Fun Travel & Tours!"
        })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Bill sent successfully to " + email);
      } else {
        alert(`❌ Error: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error sending bill:", err);
      alert("❌ Failed to send bill.");
    }
  };

  fetchAcceptedBookings();
});
