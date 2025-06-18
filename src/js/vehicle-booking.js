document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vehicleBookingForm");

  if (!form) {
    console.warn("⚠️ vehicleBookingForm not found on this page.");
    return;
  }

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
      const response = await fetch("/api/vehicle-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Vehicle booking submitted successfully!");
        form.reset();
      } else {
        console.warn("❌ Booking failed:", result.error || "Unknown error");
        alert("❌ Booking failed: " + (result.error || "Unknown error"));
      }

    } catch (err) {
      console.error("❌ Booking submission error:", err);
      alert("❌ Failed to submit booking. Please try again.");
    }
  });
});
