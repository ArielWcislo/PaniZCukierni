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

buildGallery('#gallerySwiperBasic', typeof GALERIA !== 'undefined' ? GALERIA : []);
buildGallery('#gallerySwiperMono', typeof MONODESERY !== 'undefined' ? MONODESERY : []);

// ── SWIPER ──
function createGallerySwiper(containerSelector, prevSelector, nextSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  return new Swiper(containerSelector, {
    slidesPerView: 1.2,
    spaceBetween: 12,
    loop: true,
    grabCursor: true,
    touchEventsTarget: 'container',
    passiveListeners: true,
    observer: true,
    observeParents: true,
    navigation: {
      prevEl: prevSelector,
      nextEl: nextSelector,
      disabledClass: 'swiper-button-disabled',
    },
    breakpoints: {
      480: { slidesPerView: 1, spaceBetween: 12 },
      768: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 2.5, spaceBetween: 16 },
      1440: { slidesPerView: 3, spaceBetween: 20 },
    },
  });
}

const basicSwiper = createGallerySwiper(
  '#gallerySwiperBasic',
  '#gallery-basic-prev',
  '#gallery-basic-next'
);

const monoSwiper = createGallerySwiper(
  '#gallerySwiperMono',
  '#gallery-mono-prev',
  '#gallery-mono-next'
);

// ── LIGHTBOX ──
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

// ── LIGHTBOX DLA OBU GALERII ──
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

bindGalleryLightbox('gallerySwiperBasic');
bindGalleryLightbox('gallerySwiperMono');

// ── ZAKŁADKI GALERII ──
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryPanels = document.querySelectorAll('.gallery-panel');

function updateVisibleSwiper(panelId) {
  if (panelId === 'panel-podstawowa' && basicSwiper) {
    basicSwiper.update();
    basicSwiper.slideToLoop(0, 0, false);
  }

  if (panelId === 'panel-monodesery' && monoSwiper) {
    monoSwiper.update();
    monoSwiper.slideToLoop(0, 0, false);
  }
}

function activateGalleryTab(tab) {
  const targetId = tab.getAttribute('aria-controls');
  const targetPanel = document.getElementById(targetId);

  if (!targetPanel) return;

  galleryTabs.forEach((btn) => {
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('tabindex', '-1');
    btn.classList.remove('is-active');
  });

  galleryPanels.forEach((panel) => {
    panel.hidden = true;
  });

  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');
  tab.classList.add('is-active');

  targetPanel.hidden = false;
  updateVisibleSwiper(targetId);
}

if (galleryTabs.length && galleryPanels.length) {
  galleryTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateGalleryTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      let nextIndex = index;

      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % galleryTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + galleryTabs.length) % galleryTabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = galleryTabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      galleryTabs[nextIndex].focus();
      activateGalleryTab(galleryTabs[nextIndex]);
    });
  });
}
