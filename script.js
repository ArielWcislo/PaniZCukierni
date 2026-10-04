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

  wrapper.innerHTML = items.map(({ src, caption }, i) => `
    <div class="swiper-slide" data-full="${src}">
      <img
        src="${src}"
        alt="${caption || ''}"
        width="600"
        height="800"
        loading="${i < 3 ? 'eager' : 'lazy'}"
      />
    </div>
  `).join('');
}

const galleryCategories = typeof KATEGORIE_GALERII !== 'undefined' ? KATEGORIE_GALERII : [];
galleryCategories.forEach(({ id, items }) => buildGallery(`#gallery-${id}`, items));

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
    observer: true,
    observeParents: true,
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
galleryCategories.forEach(({ id, items }) => {
  gallerySwipers.set(`panel-${id}`, createGallerySwiper(
    `#gallery-${id}`,
    `#gallery-${id}-prev`,
    `#gallery-${id}-next`,
    `#gallery-${id}-pagination`,
    items.length === 1 ? { slidesPerView: 1, breakpoints: {}, grabCursor: false } : {}
  ));
});

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

  let dragStartX = 0;
  let dragStartY = 0;

  galleryEl.addEventListener('mousedown', (e) => {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  });

  galleryEl.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
  }, { passive: true });

  galleryEl.addEventListener('click', (e) => {
    const moveX = Math.abs((e.clientX || 0) - dragStartX);
    const moveY = Math.abs((e.clientY || 0) - dragStartY);

    if (moveX > 6 || moveY > 6) return;

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

galleryCategories.forEach(({ id }) => bindGalleryLightbox(`gallery-${id}`));

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
    updateVisibleSwiper(initialTab.getAttribute('aria-controls'));
  }
}