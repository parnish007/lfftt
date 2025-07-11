document.addEventListener("DOMContentLoaded", async () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    alert("Tour slug not provided in URL.");
    return;
  }

  const form = document.getElementById("editTourForm");
  const itineraryContainer = document.getElementById("itineraryContainer");
  const overviewHTMLDiv = document.getElementById("overviewHTML");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");

  try {
    const res = await fetch(`/api/tours/${slug}`);
    if (!res.ok) throw new Error("Tour not found");
    const tour = await res.json();

    form.name.value = tour.name || '';
    form.description.value = tour.description || '';
    form.currency.value = tour.currency || 'NPR';
    form.price.value = tour.price || '';
    form.duration.value = tour.duration || 1;
    form.activities.value = (tour.activities || []).join(', ');
    form.accommodation.value = tour.accommodation || '';
    form.meals.value = tour.meals || '';
    overviewHTMLDiv.innerHTML = tour.overviewHTML || tour.overview || '';

    (tour.itineraryDays || []).forEach((day, index) => {
      const div = document.createElement('div');
      div.className = 'day-itinerary';
      div.innerHTML = `
        <label>Day ${index + 1} Itinerary</label>
        <textarea name="itineraryDay" data-day="${index + 1}" required>${day}</textarea>
      `;
      itineraryContainer.appendChild(div);
    });

    (tour.images || []).forEach(imgPath => {
      const img = document.createElement("img");
      const finalPath = imgPath.startsWith("http") ? imgPath : `/uploads/${imgPath}`;
      img.src = finalPath;
      img.alt = "Tour Image";
      img.style.maxWidth = "120px";
      img.style.marginRight = "8px";
      img.style.borderRadius = "4px";
      imagePreviewContainer.appendChild(img);
    });

  } catch (err) {
    console.error("❌ Failed to load tour:", err);
    alert("Failed to load tour details.");
  }

  document.getElementById('images').addEventListener('change', function () {
    imagePreviewContainer.innerHTML = '';
    Array.from(this.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Preview";
        img.style.maxWidth = "120px";
        img.style.marginRight = "8px";
        img.style.borderRadius = "4px";
        imagePreviewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name.value.trim());
    formData.append("description", form.description.value.trim());
    formData.append("currency", form.currency.value);
    formData.append("price", form.price.value.trim());
    formData.append("duration", form.duration.value);
    formData.append("accommodation", form.accommodation.value.trim());
    formData.append("meals", form.meals.value.trim());
    formData.append("overviewHTML", overviewHTMLDiv.innerHTML.trim());
    formData.append("activities", form.activities.value.trim());

    const itineraryTexts = document.querySelectorAll('textarea[name="itineraryDay"]');
    itineraryTexts.forEach((textarea, index) => {
      formData.append(`itineraryDay${index}`, textarea.value.trim());
    });
    formData.append('itineraryCount', itineraryTexts.length);

    const newImages = form.images.files;
    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }

    try {
      const res = await fetch(`/api/tours/${slug}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");
      alert("✅ Tour updated successfully!");
      window.location.href = "/admin/manage-tours.html";
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update tour. Please try again.");
    }
  });
});

// ✅ Fix: Enable "Add Day" itinerary button
window.addDayItinerary = () => {
  const itineraryContainer = document.getElementById("itineraryContainer");
  const dayCount = itineraryContainer.querySelectorAll('.day-itinerary').length + 1;

  const div = document.createElement('div');
  div.className = 'day-itinerary';
  div.innerHTML = `
    <label>Day ${dayCount} Itinerary</label>
    <textarea name="itineraryDay" data-day="${dayCount}" required></textarea>
  `;
  itineraryContainer.appendChild(div);
};
