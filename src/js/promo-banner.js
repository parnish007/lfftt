let currentBannerIndex = 0;
let banners = [];
let slideInterval;

async function loadBanners() {
  try {
    const res = await fetch('/api/banners');
    banners = await res.json();

    if (banners.length === 0) {
      document.getElementById('promo').innerHTML = '<p>No current promotions.</p>';
      return;
    }

    buildCarouselDots();
    showBanner(currentBannerIndex);

    slideInterval = setInterval(nextBanner, 5000);
  } catch (err) {
    console.error('❌ Error loading banners:', err);
    document.getElementById('promo').innerHTML = '<p>Failed to load promotions.</p>';
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
  const banner = banners[index];
  const promoSection = document.getElementById('promo');

  let imagePath = banner.image;
  
  // ✅ Normalize path if full system path is stored (e.g., "C:/Users/…/uploads/xxx.png")
  if (imagePath && imagePath.includes('uploads/')) {
    const splitPath = imagePath.split('uploads/');
    imagePath = `uploads/${splitPath[1]}`;
  }

  const slideContainer = document.createElement('div');
  slideContainer.className = 'promo-slide active';
  slideContainer.innerHTML = `
    <h2>${banner.headline || 'Amazing Offer!'}</h2>
    <p>${banner.description || 'Stay tuned for our latest deals and promos.'}</p>
    ${
      imagePath
        ? `<img src="/${imagePath}" alt="Promo Banner Image" style="max-width: 100%; height: auto;">`
        : '<p style="color: #ddd;">No image available.</p>'
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
