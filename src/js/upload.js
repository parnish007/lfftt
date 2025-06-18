// upload.js
// Handles admin uploads for tours, vehicles, banners, etc. (frontend only)

document.addEventListener("DOMContentLoaded", () => {
  const tourForm = document.getElementById("addTourForm");
  const vehicleForm = document.getElementById("addVehicleForm");
  const bannerForm = document.getElementById("bannerForm");

  const handleUpload = (form, type) => {
    if (!form) {
      console.warn(`⚠️ ${type} form not found on this page.`);
      return;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll("input, textarea, select");
      const data = {};

      inputs.forEach(input => {
        if (input.type === "file") {
          if (input.files.length > 0) {
            data[input.name || "file"] = Array.from(input.files).map(f => f.name); // Capture all files
          }
        } else {
          const key = input.name || input.placeholder || `field_${input.type}`;
          data[key] = input.value.trim();
        }
      });

      console.log(`📤 ${type} form submitted:`, data);
      alert(`✅ ${type} submitted successfully! (Check console for data)`);
      form.reset();
    });
  };

  handleUpload(tourForm, "Tour");
  handleUpload(vehicleForm, "Vehicle");
  handleUpload(bannerForm, "Banner");
});
