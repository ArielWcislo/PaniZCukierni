// Rok w stopce
document.getElementById('year').textContent = new Date().getFullYear();


// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});


// ── BUDUJ GALERIĘ Z galeria.js ──
function buildGallery() {
  const wrapper = document.querySelector('#gallerySwiper .swiper-wrapper');
  if (!wrapper || typeof GALERIA === 'undefined') return;

  wrapper.innerHTML = GALERIA.map(({ src, caption }, i) => `
    <div class="swiper-slide" data-full="${src}">
      <img
        src="${src}"
        alt="${caption}"
        width="600"
        height="800"
        loading="${i < 3 ? 'eager' : 'lazy'}"
      />
    </div>
  `).join('');
}

buildGallery();


// ── SWIPER ──
const swiper = new Swiper('#gallerySwiper', {
  slidesPerView: 1.2,
  spaceBetween: 12,
  loop: true,
  grabCursor: true,
  touchEventsTarget: 'container',
  passiveListeners: true,
  navigation: {
    prevEl: '#gallery-prev',
    nextEl: '#gallery-next',
    disabledClass: 'swiper-button-disabled',
  },
  breakpoints: {
    480: { slidesPerView: 1, spaceBetween: 12 },
    768: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 2.5, spaceBetween: 16 },
    1440: { slidesPerView: 3, spaceBetween: 20 },
  },
});


// ── LIGHTBOX ──
function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || 'Podgląd zdjęcia';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}


// Klik na slajd — rozróżniamy klik od drag
let dragStartX = 0;
const galleryEl = document.getElementById('gallerySwiper');

galleryEl.addEventListener('mousedown', e => {
  dragStartX = e.clientX;
});

galleryEl.addEventListener('click', e => {
  if (Math.abs(e.clientX - dragStartX) > 5) return;

  const slide = e.target.closest('.swiper-slide');
  if (!slide) return;

  const src = slide.dataset.full || slide.querySelector('img').src;
  const alt = slide.querySelector('img').alt;
  openLightbox(src, alt);
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
