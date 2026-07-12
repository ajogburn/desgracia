/**
 * DesGracia Ink — site interactions
 * Mobile nav, header scroll, gallery filter + lightbox (portfolio page)
 */

(function () {
  'use strict';

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Header scroll (Tailwind classes only) ----------
  const header = document.getElementById('site-header');
  const headerScrolled =
    'bg-ink-900/95 backdrop-blur-md border-b border-ink-600 shadow-lg shadow-black/40';

  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add(...headerScrolled.split(' '));
    } else {
      header.classList.remove(...headerScrolled.split(' '));
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  function setMenuOpen(open) {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(open);
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // ---------- Gallery filter (portfolio page) ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  const filterActive = ['border-blood', 'bg-blood', 'text-bone'];
  const filterIdle = ['border-ink-500', 'bg-transparent', 'text-ash'];

  function setFilterActive(btn, active) {
    if (active) {
      btn.classList.remove(...filterIdle);
      btn.classList.add(...filterActive);
    } else {
      btn.classList.remove(...filterActive);
      btn.classList.add(...filterIdle);
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach((b) => setFilterActive(b, b === btn));

      galleryItems.forEach((item) => {
        // Support space-separated multi-style tags, e.g. "realism portrait"
        const cats = (item.getAttribute('data-category') || '')
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);
        const show = filter === 'all' || cats.includes(filter);
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // ---------- Lightbox (portfolio page) ----------
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbStyle = document.getElementById('lightbox-style');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;
  const visibleItems = () =>
    galleryItems.filter((item) => !item.classList.contains('hidden'));

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = ((index % items.length) + items.length) % items.length;
    const item = items[currentIndex];
    const src = item.getAttribute('data-src') || '';
    const title = item.getAttribute('data-title') || '';
    const style = item.getAttribute('data-style') || '';

    if (lbImg) {
      lbImg.src = src;
      lbImg.alt = title;
    }
    if (lbTitle) lbTitle.textContent = title;
    if (lbStyle) lbStyle.textContent = style;

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    lbClose?.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    if (lbImg) lbImg.src = '';
  }

  function stepLightbox(delta) {
    openLightbox(currentIndex + delta);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const idx = items.indexOf(item);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => stepLightbox(-1));
  lbNext?.addEventListener('click', () => stepLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
})();
