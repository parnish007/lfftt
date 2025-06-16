document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    alert("❌ No vehicle slug provided in URL.");
    return;
  }

  try {
    const res = await fetch(`/api/vehicles/${slug}`);
    if (!res.ok) throw new Error("Vehicle not found");

    const vehicle = await res.json();

    document.querySelector(".vehicle-title").textContent = vehicle.name || "Untitled Vehicle";
    document.querySelector(".vehicle-description").textContent = vehicle.description || "";
    document.querySelector(".vehicle-type").textContent = vehicle.vehicleType || "N/A";
    document.querySelector(".vehicle-seats").textContent = vehicle.seatingCapacity || "N/A";
    document.querySelector(".vehicle-price").textContent = vehicle.pricePerDay || "N/A";
    document.querySelector(".vehicle-notes").textContent = vehicle.notes || "";

    const mediaContainer = document.querySelector(".vehicle-media");
    mediaContainer.innerHTML = "";

    if (vehicle.images && vehicle.images.length > 0) {
      vehicle.images.forEach(img => {
        const image = document.createElement("img");
        image.src = `../../${img}`;
        image.alt = vehicle.name;
        mediaContainer.appendChild(image);
      });
    }

    if (vehicle.videos && vehicle.videos.length > 0) {
      vehicle.videos.forEach(videoPath => {
        const video = document.createElement("video");
        video.src = `../../${videoPath}`;
        video.controls = true;
        mediaContainer.appendChild(video);
      });
    }

  } catch (err) {
    console.error("❌ Failed to load vehicle details:", err);
    alert("Failed to load vehicle details. Please try again later.");
  }
});
