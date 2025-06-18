document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    alert("❌ No vehicle slug provided in URL.");
    return;
  }

  try {
    const res = await fetch(`/api/vehicles/${slug}`);
    if (!res.ok) throw new Error(`Vehicle not found (status ${res.status})`);

    const vehicle = await res.json();

    const titleEl = document.querySelector(".vehicle-title");
    const descEl = document.querySelector(".vehicle-description");
    const typeEl = document.querySelector(".vehicle-type");
    const seatsEl = document.querySelector(".vehicle-seats");
    const priceEl = document.querySelector(".vehicle-price");
    const notesEl = document.querySelector(".vehicle-notes");
    const mediaContainer = document.querySelector(".vehicle-media");

    if (!titleEl || !descEl || !typeEl || !seatsEl || !priceEl || !notesEl || !mediaContainer) {
      console.warn("⚠️ One or more required elements are missing on this page.");
      return;
    }

    titleEl.textContent = vehicle.name || "Untitled Vehicle";
    descEl.textContent = vehicle.description || "";
    typeEl.textContent = vehicle.vehicleType || "N/A";
    seatsEl.textContent = vehicle.seatingCapacity || "N/A";
    priceEl.textContent = vehicle.pricePerDay || "N/A";
    notesEl.textContent = vehicle.notes || "";

    mediaContainer.innerHTML = "";

    if (vehicle.images && vehicle.images.length > 0) {
      vehicle.images.forEach(img => {
        const image = document.createElement("img");
        image.src = img.startsWith('/uploads/') ? img : `/uploads/${img}`;
        image.alt = vehicle.name || "Vehicle image";
        image.style.maxWidth = "100%";
        image.style.borderRadius = "8px";
        image.style.margin = "10px 0";
        mediaContainer.appendChild(image);
      });
    }

    if (vehicle.videos && vehicle.videos.length > 0) {
      vehicle.videos.forEach(videoPath => {
        const video = document.createElement("video");
        video.src = videoPath.startsWith('/uploads/') ? videoPath : `/uploads/${videoPath}`;
        video.controls = true;
        video.style.maxWidth = "100%";
        video.style.margin = "10px 0";
        mediaContainer.appendChild(video);
      });
    }

  } catch (err) {
    console.error("❌ Failed to load vehicle details:", err);
    alert("Failed to load vehicle details. Please try again later.");
  }
});
