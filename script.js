// ── ROK W STOPCE ──
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── BUDOWANIE GALERII Z DANYCH ──
function buildGallery(swiperSelector, items = []) {
  const wrapper = document.querySelector(`${swiperSelector} .swiper-wrapper`);
  if (!wrapper || !Array.isArray(items)) return;

  const sizes = items.length === 1
    ? '(max-width: 640px) calc(100vw - 32px), (max-width: 664px) calc(100vw - 64px), 600px'
    : '(min-width: 1744px) 547px, (min-width: 1440px) calc((100vw - 104px) / 3), (min-width: 1024px) calc((100vw - 88px) / 2.5), (min-width: 768px) calc((100vw - 80px) / 2), (min-width: 641px) calc(100vw - 64px), (min-width: 480px) calc(100vw - 32px), calc((100vw - 44px) / 1.2)';

  wrapper.innerHTML = items.map(({ src, srcset, full, caption }, i) => `
    <div class="swiper-slide" data-full="${full || src}">
      <img
        src="${src}"
        ${srcset ? `srcset="${srcset}" sizes="${sizes}"` : ''}
        alt="${caption || ''}"
        width="1080"
        height="1350"
        loading="${i === 0 ? 'eager' : 'lazy'}"
        decoding="async"
      />
    </div>
  `).join('');
}

const galleryCategories = typeof KATEGORIE_GALERII !== 'undefined' ? KATEGORIE_GALERII : [];
const initializedGalleries = new Set();

function createGallerySwiper(containerSelector, prevSelector, nextSelector, paginationSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container || typeof Swiper === 'undefined') return null;

  const prevEl = prevSelector ? document.querySelector(prevSelector) : null;
  const nextEl = nextSelector ? document.querySelector(nextSelector) : null;
  const paginationEl = paginationSelector ? document.querySelector(paginationSelector) : null;

  const config = {
    slidesPerView: 1.2,
    spaceBetween: 12,
    loop: false,
    watchOverflow: true,
    grabCursor: true,
    touchEventsTarget: 'container',
    passiveListeners: true,
    breakpoints: {
      480: { slidesPerView: 1, spaceBetween: 12 },
      768: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 2.5, spaceBetween: 16 },
      1440: { slidesPerView: 3, spaceBetween: 20 },
    },
    ...options,
  };

  if (prevEl && nextEl) {
    config.navigation = {
      prevEl,
      nextEl,
      disabledClass: 'swiper-button-disabled',
    };
  }

  if (paginationEl) {
    config.pagination = {
      el: paginationEl,
      clickable: true,
      renderBullet(index, className) {
        return `<button type="button" class="${className}" aria-label="Zdjęcie ${index + 1}"></button>`;
      },
    };
  }

  return new Swiper(containerSelector, config);
}

const gallerySwipers = new Map();

function initializeGallery(panelId) {
  if (initializedGalleries.has(panelId)) return;
  const category = galleryCategories.find(({ id }) => `panel-${id}` === panelId);
  if (!category) return;

  const { id, items } = category;
  buildGallery(`#gallery-${id}`, items);
  bindGalleryLightbox(`gallery-${id}`);
  if (items.length > 1) {
    gallerySwipers.set(panelId, createGallerySwiper(
      `#gallery-${id}`,
      `#gallery-${id}-prev`,
      `#gallery-${id}-next`,
      `#gallery-${id}-pagination`
    ));
  }
  initializedGalleries.add(panelId);
}

// Lightbox
function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Podgląd zdjęcia';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (!lightbox || !lightboxImg) return;

  lightbox.classList.remove('open');
  lightboxImg.src = '';
  lightboxImg.alt = '';
  document.body.style.overflow = '';
}

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ── LIGHTBOX DLA GALERII ──
function bindGalleryLightbox(galleryId) {
  const galleryEl = document.getElementById(galleryId);
  if (!galleryEl) return;

  galleryEl.addEventListener('click', (e) => {
    // Swiper distinguishes a tap from dragging for both mouse and touch input.
    if (galleryEl.swiper && !galleryEl.swiper.allowClick) return;

    const slide = e.target.closest('.swiper-slide');
    if (!slide) return;

    const img = slide.querySelector('img');
    const src = slide.dataset.full || img?.src;
    const alt = img?.alt || 'Podgląd zdjęcia';

    if (src) {
      openLightbox(src, alt);
    }
  });
}

// Zakładki galerii
const galleryTabs = Array.from(document.querySelectorAll('.gallery-tab'));
const galleryPanels = document.querySelectorAll('.gallery-panel');

function getVisibleGalleryTabs() {
  return galleryTabs.filter((tab) => !tab.hidden);
}

function updateVisibleSwiper(panelId) {
  const swiper = gallerySwipers.get(panelId);
  if (!swiper) return;
  swiper.update();
  swiper.slideTo(0, 0, false);
}

function activateGalleryTab(tab) {
  const targetId = tab.getAttribute('aria-controls');
  const targetPanel = document.getElementById(targetId);
  if (!targetPanel) return;
  galleryTabs.forEach((button) => {
    const active = button === tab;
    button.setAttribute('aria-selected', String(active));
    button.setAttribute('tabindex', active ? '0' : '-1');
    button.classList.toggle('is-active', active);
  });
  galleryPanels.forEach((panel) => {
    panel.hidden = panel !== targetPanel;
    panel.classList.remove('is-fading-out', 'is-fading-in');
  });
  initializeGallery(targetId);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targetPanel.classList.add('is-fading-in');
    targetPanel.addEventListener('animationend', () => targetPanel.classList.remove('is-fading-in'), { once: true });
  }
  updateVisibleSwiper(targetId);
}

if (galleryTabs.length && galleryPanels.length) {
  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateGalleryTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      const visibleTabs = getVisibleGalleryTabs();
      const currentIndex = visibleTabs.indexOf(tab);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % visibleTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = visibleTabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      visibleTabs[nextIndex].focus();
      activateGalleryTab(visibleTabs[nextIndex]);
    });
  });

  const visibleTabs = getVisibleGalleryTabs();
  const initialTab =
    visibleTabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ||
    visibleTabs[0];

  if (initialTab) {
    initializeGallery(initialTab.getAttribute('aria-controls'));
    updateVisibleSwiper(initialTab.getAttribute('aria-controls'));
  }
}
