// src/js/manage-bookings.js

document.addEventListener("DOMContentLoaded", () => {
  const bookingList = document.getElementById("bookingList");

  // ✅ Load all bookings on page load
  async function loadBookings() {
    try {
      const res = await fetch("/api/bookings");
      const bookings = await res.json();

      bookingList.innerHTML = "";

      if (bookings.length === 0) {
        bookingList.innerHTML = "<tr><td colspan='12'>No bookings found.</td></tr>";
        return;
      }

      bookings.forEach(booking => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${booking.name}</td>
          <td>${booking.email}</td>
          <td>${booking.phone}</td>
          <td>${booking.title} (${booking.type})</td>
          <td>${booking.origin} → ${booking.destination}</td>
          <td>${new Date(booking.startDate).toLocaleDateString()}</td>
          <td>${booking.people}</td>
          <td>${booking.hotel || 'N/A'}</td>
          <td>${booking.payment}</td>
          <td>${booking.notes || 'N/A'}</td>
          <td>${booking.status}</td>
          <td>
            <button class="confirm" onclick="updateBookingStatus('${booking._id}', 'Confirmed')">Confirm</button>
            <button class="cancel" onclick="updateBookingStatus('${booking._id}', 'Cancelled')">Cancel</button>
            <button class="delete" onclick="deleteBooking('${booking._id}')">Delete</button>
          </td>
        `;

        bookingList.appendChild(row);
      });
    } catch (err) {
      console.error("❌ Error loading bookings:", err);
      bookingList.innerHTML = "<tr><td colspan='12'>Failed to load bookings. Please try again later.</td></tr>";
    }
  }

  // ✅ Update booking status via PATCH request
  window.updateBookingStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Booking status updated!");
        loadBookings();
      } else {
        alert(`❌ Failed to update booking status: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error updating booking status:", err);
      alert("❌ Failed to update booking status.");
    }
  };

  // ✅ Delete booking
  window.deleteBooking = async (id) => {
    if (!confirm("🗑️ Are you sure you want to permanently delete this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
      });

      const result = await res.json();

      if (res.ok) {
        alert("🗑️ Booking deleted successfully.");
        loadBookings();
      } else {
        alert(`❌ Failed to delete booking: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
      alert("❌ Network error while deleting booking.");
    }
  };

  // 🔄 Load bookings on initial page load
  loadBookings();
});
