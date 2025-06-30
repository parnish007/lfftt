document.addEventListener("DOMContentLoaded", async () => {
  const imageSections = [
    {
      id: 'hero',
      label: 'Hero Background',
      defaultPath: '/images/backgrounds/mountain.jpeg'
    },
    {
      id: 'tour',
      label: 'Tour Image',
      defaultPath: '/images/backgrounds/back.png'
    },
    {
      id: 'vehicle',
      label: 'Vehicle Image',
      defaultPath: '/images/backgrounds/vehicle.png'
    },
    {
      id: 'trekking',
      label: 'Trekking Image',
      defaultPath: '/images/backgrounds/trek.png'
    },
    {
      id: 'flight',
      label: 'Flight Image',
      defaultPath: '/images/backgrounds/flight.png'
    },
    {
      id: 'logo',
      label: 'Logo Image',
      defaultPath: '/images/backgrounds/logo.jpeg'
    }
  ];

  const container = document.getElementById("imageSettingsContainer");

  if (!container) {
    console.warn("⚠️ imageSettingsContainer not found on this page.");
    return;
  }

  // Fetch current settings from backend
  let currentSettings = {};
  try {
    const res = await fetch("/api/image-settings");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach(entry => currentSettings[entry.section] = entry);
      }
    }
  } catch (e) {
    console.warn("⚠️ Could not load current image settings.", e);
  }

  imageSections.forEach(section => {
    const current = currentSettings[section.id];
    const activeMode = current?.mode || 'default';
    const activePath = activeMode === 'upload' ? current.path : section.defaultPath;

    const block = document.createElement("div");
    block.className = "image-block";
    block.innerHTML = `
      <h3>${section.label}</h3>
      <label for="${section.id}-mode">Select Mode:</label>
      <select id="${section.id}-mode">
        <option value="default" ${activeMode === 'default' ? 'selected' : ''}>Use Default</option>
        <option value="upload" ${activeMode === 'upload' ? 'selected' : ''}>Upload New</option>
      </select>

      <label for="${section.id}-file">Choose Image:</label>
      <input type="file" id="${section.id}-file" accept="image/*" ${activeMode === 'upload' ? '' : 'disabled'} />

      <div class="preview" id="${section.id}-preview">
        <img src="${activePath}" alt="${section.label}" style="width: 100%; max-height: 180px; object-fit: cover; margin-top: 10px;" />
      </div>

      <button class="btn" onclick="saveImageSetting('${section.id}', '${section.defaultPath}')">Save</button>
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

async function saveImageSetting(sectionId, defaultPath) {
  const mode = document.getElementById(`${sectionId}-mode`).value;
  const fileInput = document.getElementById(`${sectionId}-file`);

  if (!mode) {
    alert(`❌ No mode selected for ${sectionId}`);
    return;
  }

  try {
    if (mode === "default") {
      const res = await fetch(`/api/image-settings/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'default' })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Default reset failed');
      }

      alert("✅ Default image selected for " + sectionId);

      const previewImg = document.querySelector(`#${sectionId}-preview img`);
      if (previewImg) {
        previewImg.src = defaultPath;
      }

    } else if (fileInput.files[0]) {
      const formData = new FormData();
      formData.append("image", fileInput.files[0]);

      const res = await fetch(`/api/image-settings/${sectionId}`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { path } = await res.json();
      const previewImg = document.querySelector(`#${sectionId}-preview img`);
      if (previewImg && path) {
        previewImg.src = path;
      }

      alert("✅ New image uploaded for " + sectionId);

    } else {
      alert("❌ No file selected for " + sectionId);
    }
  } catch (err) {
    console.error("❌ Error saving image:", err);
    alert("❌ Error: " + err.message);
  }
}
