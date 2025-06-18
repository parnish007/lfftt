document.addEventListener("DOMContentLoaded", () => {
  const bannerForm = document.getElementById("bannerForm");
  const bannerList = document.getElementById("bannerList");

  if (!bannerForm || !bannerList) {
    console.warn("⚠️ bannerForm or bannerList not found on this page.");
    return;
  }

  // Load banners on page load
  loadBanners();

  // Handle form submission
  bannerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(bannerForm);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Banner added!");
        bannerForm.reset();
        loadBanners();
      } else {
        console.error("❌ Failed to add banner:", result);
        alert(`❌ Failed to add banner: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("❌ Error adding banner:", err);
      alert("❌ Failed to add banner. Check console for details.");
    }
  });

  // Load and display banners
  async function loadBanners() {
    try {
      const res = await fetch("/api/banners");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      
      const banners = await res.json();

      bannerList.innerHTML = "";

      if (!Array.isArray(banners) || banners.length === 0) {
        bannerList.innerHTML = "<p>No banners available.</p>";
        return;
      }

      banners.forEach(banner => {
        const card = document.createElement("div");
        card.className = "banner-card";
        card.innerHTML = `
          ${banner.image ? `<img src="/${banner.image}" alt="${banner.headline}" style="max-width: 100%; height: auto;">` : ''}
          <h3>${banner.headline || 'No headline'}</h3>
          <p>${banner.description || ''}</p>
          <button class="delete-btn" data-id="${banner._id}">🗑 Delete</button>
        `;
        bannerList.appendChild(card);
      });

      // Attach event listeners to all delete buttons
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          if (!confirm("Are you sure you want to delete this banner?")) return;
          try {
            const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
            const result = await res.json();
            if (res.ok) {
              alert("✅ Banner deleted!");
              loadBanners();
            } else {
              console.error("❌ Failed to delete banner:", result);
              alert(`❌ Failed to delete banner: ${result.error || 'Unknown error'}`);
            }
          } catch (err) {
            console.error("❌ Error deleting banner:", err);
            alert("❌ Failed to delete banner.");
          }
        });
      });
    } catch (err) {
      console.error("❌ Error loading banners:", err);
      bannerList.innerHTML = "<p>Failed to load banners. Please try again later.</p>";
    }
  }
});
