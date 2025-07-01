document.addEventListener("DOMContentLoaded", async () => {
  const sections = ["logo", "hero", "tour", "vehicle", "trekking", "flight"];
  const idMap = {
    logo: "logo-img",
    hero: "hero-img",
    tour: "tour-img",
    vehicle: "vehicle-img",
    trekking: "trekking-img",
    flight: "flight-img"
  };

  try {
    const res = await fetch("/api/image-settings");
    if (!res.ok) throw new Error("Failed to fetch image settings");
    const data = await res.json();

    sections.forEach(section => {
      const setting = data.find(img => img.sectionId === section);
      if (setting && !setting.useDefault && setting.imagePath) {
        const imgEl = document.getElementById(idMap[section]);
        if (imgEl) {
          imgEl.src = setting.imagePath;
        }
      }
    });
  } catch (err) {
    console.error("❌ Failed to load dynamic images:", err);
  }
});

// Enable horizontal scroll on wheel for mobile navbar slider
document.querySelectorAll('.navbar-links').forEach(nav => {
  nav.addEventListener('wheel', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      nav.scrollLeft += e.deltaY;
    }
  });
});
</script>

<script>
// Enable click-and-drag horizontal scroll for mobile navbar slider
document.querySelectorAll('.navbar-links').forEach(nav => {
  let isDown = false;
  let startX, scrollLeft;

  nav.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - nav.offsetLeft;
    scrollLeft = nav.scrollLeft;
  });
  nav.addEventListener('mouseleave', () => { isDown = false; });
  nav.addEventListener('mouseup', () => { isDown = false; });
  nav.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - nav.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed multiplier
    nav.scrollLeft = scrollLeft - walk;
  });
});

