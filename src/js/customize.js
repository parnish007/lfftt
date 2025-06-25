document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[action='/api/custom-tour-request']");

  if (!form) {
    console.warn("⚠️ Customize form not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const requestData = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      origin: formData.get("origin")?.trim(),
      destination: formData.get("destination")?.trim(),
      budget: formData.get("budget")?.trim(),
      duration: formData.get("duration")?.trim(),
      vehicle: formData.get("vehicle")?.trim(),
      other: formData.get("other")?.trim()
    };

    // Basic client-side validation
    if (!requestData.name || !requestData.email || !requestData.phone) {
      alert("❗Please fill in your name, email, and phone number.");
      return;
    }

    try {
      const res = await fetch("/api/custom-tour-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      if (res.ok) {
        alert("✅ Your custom tour request has been submitted!");
        form.reset(); // Optional reset
        window.location.href = "/index.html"; // Or redirect to confirmation page
      } else {
        const error = await res.json();
        alert("❌ Error: " + (error.message || "Submission failed."));
      }
    } catch (err) {
      console.error("❌ Request error:", err);
      alert("❌ Network or server error occurred.");
    }
  });
});
