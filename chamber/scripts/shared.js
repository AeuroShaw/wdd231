/* ============================================================
   Ibadan Chamber – shared.js
   Loaded by every page. Handles:
     • Mobile nav toggle (with dynamic top positioning)
     • Footer copyright year + last modified
   ============================================================ */
'use strict';

// ── FOOTER META ──────────────────────────────────────────────
const copyrightYr  = document.getElementById('copyright-year');
const lastModified = document.getElementById('last-modified');
if (copyrightYr)  copyrightYr.textContent  = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

// ── MOBILE NAV — dynamic top position ───────────────────────
// Measures the actual rendered header height so the nav dropdown
// always opens flush below it, even when the title wraps on small screens.
const menuToggle = document.getElementById('menu-toggle');
const navEl      = menuToggle?.nextElementSibling;   // the <nav>
const navList    = document.getElementById('nav-list');
const siteHeader = document.querySelector('header');

function positionNav() {
  if (!navEl || !siteHeader) return;
  const h = siteHeader.getBoundingClientRect().height;
  navEl.style.top = h + 'px';
}

if (menuToggle && navEl) {
  // Set correct position immediately and on resize
  positionNav();
  window.addEventListener('resize', positionNav);

  menuToggle.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.textContent = isOpen ? '✕' : '☰';
    // Re-measure in case layout shifted
    positionNav();
  });

  // Close nav when a link is tapped (mobile)
  navList?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      navEl.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });

  // Close nav when clicking outside header/nav on mobile
  document.addEventListener('click', e => {
    if (!siteHeader.contains(e.target) && navEl.classList.contains('open')) {
      navEl.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });
}
