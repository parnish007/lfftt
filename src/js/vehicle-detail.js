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
      console.warn("⚠️ Required elements missing in HTML. Please check the markup.");
      return;
    }

    titleEl.textContent = vehicle.name || "Untitled Vehicle";
    descEl.textContent = vehicle.description || "No description available.";
    typeEl.textContent = vehicle.vehicleType || "N/A";
    seatsEl.textContent = vehicle.seatingCapacity || "N/A";
    priceEl.textContent = `${vehicle.currency || 'NPR'} ${vehicle.pricePerDay || 'N/A'}`;
    notesEl.textContent = vehicle.notes || "No additional notes.";

    mediaContainer.innerHTML = "";

    if (Array.isArray(vehicle.images)) {
      vehicle.images.forEach(img => {
        const imageEl = document.createElement("img");
        imageEl.src = img;
        imageEl.alt = vehicle.name || "Vehicle image";
        imageEl.style.maxWidth = "100%";
        imageEl.style.borderRadius = "8px";
        imageEl.style.margin = "10px 0";
        mediaContainer.appendChild(imageEl);
      });
    }

    if (Array.isArray(vehicle.videos)) {
      vehicle.videos.forEach(video => {
        const videoEl = document.createElement("video");
        videoEl.src = video;
        videoEl.controls = true;
        videoEl.style.maxWidth = "100%";
        videoEl.style.margin = "10px 0";
        mediaContainer.appendChild(videoEl);
      });
    }

  } catch (err) {
    console.error("❌ Failed to load vehicle details:", err);
    alert("Failed to load vehicle details. Please try again later.");
  }
});
