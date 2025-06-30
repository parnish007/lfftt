document.addEventListener("DOMContentLoaded", () => {
  const bookingContainer = document.getElementById("bookingContainer");

  if (!bookingContainer) {
    console.warn("⚠️ bookingContainer not found on this page.");
    return;
  }

  async function fetchAcceptedBookings() {
    try {
      const res = await fetch("/api/bills/unbilled");

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const bookings = await res.json();

      displayBookings(bookings);
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

    bookingContainer.innerHTML = ""; // Clear previous if any

    bookings.forEach(b => {
      const card = document.createElement("div");
      card.className = "booking-card";

      card.innerHTML = `
        <h3>${b.title || 'No title'}</h3>
        <p><strong>Name:</strong> ${b.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${b.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${b.phone || 'N/A'}</p>
        <p><strong>Type:</strong> ${b.type || 'Tour / Vehicle'}</p>
        <p><strong>Price:</strong> ${b.currencySymbol || '₨'}${b.price || 'Negotiable'}</p>

        <div class="actions">
          <button class="btn default-bill" onclick="processDefaultBill('${b._id}')">Process Bill</button>
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

    window.location.href = "/html/custom-bill.html?" + query; // ✅ Root-relative for Render
  };

  window.processDefaultBill = async (id) => {
    try {
      const res = await fetch(`/api/bills/send/${id}`, {
        method: "POST"
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Bill sent successfully.");
        fetchAcceptedBookings(); // Refresh the list after billing
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
