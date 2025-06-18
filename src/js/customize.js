document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customTourForm");
  if (!form) {
    console.warn("⚠️ customTourForm not found on this page.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requestData = {
      name: (prompt("Enter your name:") || "").trim(),
      phone: (prompt("Enter your phone number:") || "").trim(),
      origin: form.origin.value.trim(),
      destination: form.destination.value.trim(),
      budget: form.budget.value.trim(),
      days: form.days.value.trim(),
      vehicle: form.vehicle.value.trim(),
      message: form.message.value.trim()
    };

    if (!requestData.name || !requestData.phone || !requestData.origin || !requestData.destination || !requestData.budget || !requestData.days || !requestData.vehicle) {
      alert("⚠ Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      if (res.ok) {
        alert("Customization submitted successfully!");
        window.location.href = "/html/booking.html"; // ✅ Use root-relative path for Render safety
      } else {
        const error = await res.json();
        alert("Error: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      alert("Failed to submit customization.");
    }
  });
});
