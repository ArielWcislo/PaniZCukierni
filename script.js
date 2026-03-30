// Rok w stopce
document.getElementById('year').textContent = new Date().getFullYear();

// ── DARK MODE ──
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
//   let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  let theme = 'light';
  root.setAttribute('data-theme', theme);

  function updateIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Przełącz na tryb ' + (theme === 'dark' ? 'jasny' : 'ciemny'));
  }

  updateIcon();
  toggle && toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    updateIcon();
  });
})();

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
      <div class="slide-overlay">
        <span class="slide-caption">${caption}</span>
      </div>
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
    480:  { slidesPerView: 1, spaceBetween: 12 },
    768:  { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 2.5,   spaceBetween: 16 },
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

galleryEl.addEventListener('mousedown', e => { dragStartX = e.clientX; });
galleryEl.addEventListener('click', e => {
  // Jeśli przesunięto myszą o więcej niż 5px — to był drag, nie klik
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
