document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customTourForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requestData = {
      name: prompt("Enter your name:"),
      phone: prompt("Enter your phone number:"),
      origin: form.origin.value,
      destination: form.destination.value,
      budget: form.budget.value,
      days: form.days.value,
      vehicle: form.vehicle.value,
      message: form.message.value
    };

    try {
      const res = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      if (res.ok) {
        alert("Customization submitted successfully!");
        window.location.href = "../booking.html";
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      alert("Failed to submit customization.");
    }
  });
});
