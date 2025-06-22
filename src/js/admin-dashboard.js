document.addEventListener('DOMContentLoaded', () => {
  const tourBadge = document.getElementById('tour-badge');
  const vehicleBadge = document.getElementById('vehicle-badge');
  const tourLink = document.getElementById('tour-booking-link');
  const vehicleLink = document.getElementById('vehicle-booking-link');

  // Fetch new booking counts
  async function fetchBookingCounts() {
    try {
      const [tourRes, vehicleRes] = await Promise.all([
        fetch('/api/bookings/new-count'),
        fetch('/api/vehicle-bookings/new-count')
      ]);

      const tourData = await tourRes.json();
      const vehicleData = await vehicleRes.json();

      if (tourData.count > 0) {
        tourBadge.style.display = 'inline-block';
        tourBadge.textContent = tourData.count;
      } else {
        tourBadge.style.display = 'none';
      }

      if (vehicleData.count > 0) {
        vehicleBadge.style.display = 'inline-block';
        vehicleBadge.textContent = vehicleData.count;
      } else {
        vehicleBadge.style.display = 'none';
      }

    } catch (err) {
      console.error('❌ Error fetching booking counts:', err);
    }
  }

  // Clear badge on click (will auto-clear after API call marks as seen)
  tourLink.addEventListener('click', () => {
    tourBadge.style.display = 'none';
  });

  vehicleLink.addEventListener('click', () => {
    vehicleBadge.style.display = 'none';
  });

  // Initial fetch
  fetchBookingCounts();
});
