// ✅ IMAGE LOADING - DO NOT TOUCH
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

// ✅ SCROLL WHEEL SUPPORT for horizontal nav scroll (mobile)
document.querySelectorAll('.navbar-links').forEach(nav => {
  nav.addEventListener('wheel', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      nav.scrollLeft += e.deltaY;
    }
  });
});

// ✅ DRAG TO SCROLL for nav on mobile
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
    const walk = (x - startX) * 2;
    nav.scrollLeft = scrollLeft - walk;
  });
});

// ✅ ARC MENU TOGGLE LOGIC (ENHANCED)
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const arcMenu = document.querySelector('.arc-menu');

  if (!hamburger || !arcMenu) return;

  // Toggle arc menu on hamburger click
  hamburger.addEventListener('click', () => {
    arcMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    if (arcMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close arc menu on outside click
  document.addEventListener('click', (e) => {
    if (!arcMenu.contains(e.target) && !hamburger.contains(e.target)) {
      arcMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close arc menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      arcMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ✅ Touch scroll fix for arc menu
  arcMenu.addEventListener('touchmove', (e) => {
    e.stopPropagation();
  }, { passive: true });
});

// ✅ SCROLL SHADOW FOR NAVBAR
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
