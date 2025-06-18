document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) {
    console.warn("⚠️ bookingForm not found on this page.");
    return;
  }

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value.trim ? value.trim() : value;
    });

    data.title = data.package;
    delete data.package;

    data.hotel = data.accommodation;
    delete data.accommodation;

    if (data.payment === 'bank') {
      data.payment = 'BANKING APP';
    }

    data.type = 'Tour';
    data.total = calculateTotal(data);
    data.user = null;

    if (data.startDate) {
      const parsedDate = new Date(data.startDate);
      if (!isNaN(parsedDate)) {
        data.startDate = parsedDate;
      } else {
        alert("❌ Invalid date format.");
        return;
      }
    }

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
        alert("❌ Booking failed: " + (result.error || "Unknown error"));
      }

    } catch (err) {
      console.error("❌ Error submitting booking:", err);
      alert("❌ Network error while submitting booking.");
    }
  });

  function calculateTotal(data) {
    const basePricePerPerson = 1000;
    const numPeople = Math.max(parseInt(data.people, 10) || 1, 1);
    return basePricePerPerson * numPeople;
  }
});
