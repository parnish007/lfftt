// src/js/booking.js

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");

  bookingForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = {};

    // ✅ Convert form data into JSON object
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // ✅ REQUIRED FIELD MAPPINGS
    data.title = data.package;                  // map 'package' → 'title'
    delete data.package;

    data.hotel = data.accommodation;            // map 'accommodation' → 'hotel'
    delete data.accommodation;

    if (data.payment === 'bank') {
      data.payment = 'BANKING APP';             // correct value casing for enum
    }

    data.type = 'Tour';                         // hardcoded for now
    data.total = calculateTotal(data);          // simple total logic
    data.user = null;                           // guest user (unauthenticated)

    // ✅ Optional: Parse date to Date object (safe for mongoose)
    data.startDate = new Date(data.startDate);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Booking submitted successfully!");
        bookingForm.reset();
      } else {
        alert("❌ Booking failed: " + result.error);
      }

    } catch (err) {
      console.error("❌ Error submitting booking:", err);
      alert("❌ Network error while submitting booking.");
    }
  });

  // ✅ Simple total calculator
  function calculateTotal(data) {
    const basePricePerPerson = 1000; // example only
    const numPeople = parseInt(data.people, 10) || 1;
    return basePricePerPerson * numPeople;
  }
});
