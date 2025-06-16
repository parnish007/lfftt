// booking.js
// Populates booking summary page from localStorage and handles confirmation

document.addEventListener("DOMContentLoaded", () => {
  const bookingData = JSON.parse(localStorage.getItem("booking"));
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!bookingData || !userData) {
    alert("Missing booking or user information. Please start from a tour or vehicle page.");
    window.location.href = "index.html";
    return;
  }

  const summaryBox = document.querySelector(".summary-box");
  if (summaryBox) {
    summaryBox.innerHTML = `
      <h2>Customer Information</h2>
      <p><strong>Name:</strong> ${userData.name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Phone:</strong> ${userData.phone}</p>

      <hr />
      <h2>Booking Details</h2>
      <p><strong>Type:</strong> ${bookingData.type}</p>
      <p><strong>Package/Vehicle Name:</strong> ${bookingData.title}</p>
      <p><strong>Origin:</strong> ${bookingData.origin}</p>
      <p><strong>Destination:</strong> ${bookingData.destination}</p>
      <p><strong>Start Date:</strong> ${bookingData.startDate}</p>
      <p><strong>End Date:</strong> ${bookingData.endDate}</p>
      <p><strong>Number of People:</strong> ${bookingData.people}</p>
      <p><strong>Vehicle Type:</strong> ${bookingData.vehicle}</p>
      <p><strong>Hotel Details:</strong> ${bookingData.hotel}</p>

      <hr />
      <h2>Payment Summary</h2>
      <p><strong>Total Price:</strong> NPR ${bookingData.total}</p>
      <p><strong>Payment Method:</strong> ${bookingData.payment}</p>
    `;
  }

  document.querySelector(".confirm-btn")?.addEventListener("click", () => {
    alert("Booking confirmed! (This would be saved to backend in production.)");
    localStorage.removeItem("booking");
    window.location.href = "saved-tours.html";
  });

  document.querySelector(".cancel-btn")?.addEventListener("click", () => {
    if (confirm("Cancel this booking?")) {
      localStorage.removeItem("booking");
      window.location.href = "tours/tours.html";
    }
  });
});

