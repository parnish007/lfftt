document.addEventListener("DOMContentLoaded", () => {
  const bookingContainer = document.getElementById("bookingContainer");
  const billModal = document.getElementById("billModal");
  const billingForm = document.getElementById("billingForm");

  let currentBookingId = null;

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

    bookingContainer.innerHTML = "";

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

    window.location.href = "/html/custom-bill.html?" + query;
  };

  window.processDefaultBill = (id) => {
    currentBookingId = id;
    document.getElementById("amount").value = "";
    document.getElementById("currency").value = "NPR";
    billModal.style.display = "block";
  };

  window.closeModal = () => {
    billModal.style.display = "none";
    currentBookingId = null;
  };

  billingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;

    if (!amount || !currency || !currentBookingId) {
      alert("Please enter amount and select currency.");
      return;
    }

    try {
      const res = await fetch(`/api/bills/send/${currentBookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount, currency })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Bill sent successfully.");
        billModal.style.display = "none";
        currentBookingId = null;
        fetchAcceptedBookings();
      } else {
        alert(`❌ Error: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error sending bill:", err);
      alert("❌ Failed to send bill.");
    }
  });

  fetchAcceptedBookings();
});
