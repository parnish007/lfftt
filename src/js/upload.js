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

      const inputs = form.querySelectorAll("input, textarea");
      const data = {};

      inputs.forEach(input => {
        if (input.type === "file") {
          const files = input.files;
          if (files.length > 0) {
            data.image = files[0].name; // Note: Only filename stored for demo
          }
        } else {
          data[input.placeholder || input.name] = input.value;
        }
      });

      console.log(`${type} submitted:`, data);
      alert(`${type} submitted successfully!`);
      form.reset();
    });
  };

  handleUpload(tourForm, "Tour");
  handleUpload(vehicleForm, "Vehicle");
  handleUpload(bannerForm, "Banner");
});
