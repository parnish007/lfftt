let currentBannerIndex = 0;
let banners = [];
let slideInterval;

async function loadBanners() {
  try {
    const promoSection = document.getElementById('promo');
    if (!promoSection) {
      console.warn("⚠️ promo section not found on this page.");
      return;
    }

    const res = await fetch('/api/banners');
    if (!res.ok) throw new Error(`Server responded ${res.status}`);

    banners = await res.json();

    if (!Array.isArray(banners) || banners.length === 0) {
      promoSection.innerHTML = '<p>No current promotions.</p>';
      return;
    }

    buildCarouselDots();
    showBanner(currentBannerIndex);

    slideInterval = setInterval(nextBanner, 5000);
  } catch (err) {
    console.error('❌ Error loading banners:', err);
    const promoSection = document.getElementById('promo');
    if (promoSection) {
      promoSection.innerHTML = '<p>❌ Failed to load promotions.</p>';
    }
  }
}

function buildCarouselDots() {
  const promoSection = document.getElementById('promo');
  const existingDots = promoSection.querySelector('.carousel-dots');
  if (existingDots) existingDots.remove();

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  banners.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => goToBanner(i));
    dotsContainer.appendChild(dot);
  });

  promoSection.appendChild(dotsContainer);
}

function updateActiveDot() {
  const dots = document.querySelectorAll('.carousel-dots span');
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentBannerIndex]) {
    dots[currentBannerIndex].classList.add('active');
  }
}

function showBanner(index) {
  const promoSection = document.getElementById('promo');
  const banner = banners[index];

  let imagePath = banner.image;
  if (imagePath && !imagePath.startsWith('/uploads/')) {
    imagePath = `/${imagePath}`;
  }

  const slideContainer = document.createElement('div');
  slideContainer.className = 'promo-slide active';
  slideContainer.innerHTML = `
    <h2>${banner.headline || 'Amazing Offer!'}</h2>
    <p>${banner.description || 'Stay tuned for our latest deals and promos.'}</p>
    ${
      imagePath
        ? `<img src="${imagePath}" alt="Promo Banner Image" style="max-width: 100%; height: auto; border-radius: 8px;">`
        : '<p style="color: #aaa;">No image available.</p>'
    }
  `;

  const existingSlide = promoSection.querySelector('.promo-slide');
  if (existingSlide) {
    existingSlide.classList.remove('active');
    existingSlide.classList.add('fade-out');

    setTimeout(() => {
      existingSlide.remove();
      promoSection.insertBefore(slideContainer, promoSection.querySelector('.carousel-dots'));
    }, 500);
  } else {
    promoSection.insertBefore(slideContainer, promoSection.querySelector('.carousel-dots'));
  }

  updateActiveDot();
}

function nextBanner() {
  currentBannerIndex = (currentBannerIndex + 1) % banners.length;
  showBanner(currentBannerIndex);
}

function goToBanner(index) {
  clearInterval(slideInterval);
  currentBannerIndex = index;
  showBanner(currentBannerIndex);
  slideInterval = setInterval(nextBanner, 5000);
}

document.addEventListener('DOMContentLoaded', loadBanners);
