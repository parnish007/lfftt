document.addEventListener("DOMContentLoaded", () => {
  const imageSections = [
    {
      id: 'hero',
      label: 'Hero Background',
      defaultPath: '/public/images/backgrounds/mountain.jpeg'
    },
    {
      id: 'tour',
      label: 'Tour Image',
      defaultPath: '/public/images/backgrounds/back.png'
    },
    {
      id: 'vehicle',
      label: 'Vehicle Image',
      defaultPath: '/public/images/backgrounds/vehicle.png'
    },
    {
      id: 'trekking',
      label: 'Trekking Image',
      defaultPath: '/public/images/backgrounds/trek.png'
    },
    {
      id: 'flight',
      label: 'Flight Image',
      defaultPath: '/public/images/backgrounds/flight.png'
    },
    {
      id: 'logo',
      label: 'Logo Image',
      defaultPath: '/public/images/backgrounds/logo.jpeg'
    }
  ];

  const container = document.getElementById("imageSettingsContainer");

  imageSections.forEach(section => {
    const block = document.createElement("div");
    block.className = "image-block";
    block.innerHTML = `
      <h3>${section.label}</h3>
      <label for="${section.id}-mode">Select Mode:</label>
      <select id="${section.id}-mode">
        <option value="default">Use Default</option>
        <option value="upload">Upload New</option>
      </select>

      <label for="${section.id}-file">Choose Image:</label>
      <input type="file" id="${section.id}-file" accept="image/*" disabled />

      <div class="preview" id="${section.id}-preview">
        <img src="${section.defaultPath}" alt="${section.label}" style="width: 100%; max-height: 180px; object-fit: cover; margin-top: 10px;" />
      </div>

      <button class="btn" onclick="saveImageSetting('${section.id}')">Save</button>
      <hr style="margin: 30px 0;">
    `;
    container.appendChild(block);

    const modeSelector = document.getElementById(`${section.id}-mode`);
    const fileInput = document.getElementById(`${section.id}-file`);
    const previewImg = document.querySelector(`#${section.id}-preview img`);

    modeSelector.addEventListener("change", () => {
      const selectedMode = modeSelector.value;
      fileInput.disabled = selectedMode !== "upload";
      if (selectedMode === "default") {
        previewImg.src = section.defaultPath;
      }
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        previewImg.src = URL.createObjectURL(file);
      }
    });
  });
});

async function saveImageSetting(sectionId) {
  const mode = document.getElementById(`${sectionId}-mode`).value;
  const fileInput = document.getElementById(`${sectionId}-file`);

  try {
    if (mode === "default") {
      const res = await fetch(`/api/image-settings/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'default' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Default reset failed');
      alert("✅ Default image selected for " + sectionId);

    } else if (fileInput.files[0]) {
      const formData = new FormData();
      formData.append("image", fileInput.files[0]);

      const res = await fetch(`/api/image-settings/${sectionId}`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      alert("✅ New image uploaded for " + sectionId);

    } else {
      alert("❌ No file selected for " + sectionId);
    }
  } catch (err) {
    console.error("❌ Error saving image:", err);
    alert("❌ Error: " + err.message);
  }
}
