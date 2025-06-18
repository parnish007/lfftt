// /src/js/vehicle-booking.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vehicleBookingForm");

  if (!form) {
    console.warn("⚠️ vehicleBookingForm not found on this page.");
    return;
  }

  // ✅ USER SIDE: Submit booking form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name?.value.trim(),
      phone: form.phone?.value.trim(),
      email: form.email?.value.trim(),
      vehicle: form.vehicle?.value.trim(),
      origin: form.origin?.value.trim(),
      tripType: form.tripType?.value,
      travelDate: form.travelDate?.value,
      days: form.days?.value ? parseInt(form.days.value, 10) : undefined,
      message: form.message?.value.trim() || ""
    };

    try {
      const res = await fetch("/api/vehicle-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Vehicle booking submitted successfully!");
        form.reset();
      } else {
        alert("❌ Booking failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("❌ Failed to submit booking. Please try again.");
    }
  });
});
