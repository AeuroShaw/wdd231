/* ============================================================
   Ibadan Chamber – discover.mjs  (ES module)
   Imports attractions from data/attractions.mjs, builds
   8 cards with h2/figure/address/p/button structure, and
   handles the localStorage last-visit message.
   ============================================================ */

import { attractions } from '../data/attractions.mjs';

// ── RENDER ATTRACTION CARDS ──────────────────────────────────
const grid = document.getElementById('attractions-grid');

if (grid && attractions.length) {
  const fragment = document.createDocumentFragment();

  attractions.forEach((place, index) => {
    const article = document.createElement('article');
    article.className  = 'attraction-card';
    article.dataset.area = `card${index + 1}`;
    // grid-area is set via CSS using [data-area="cardN"] selectors
    article.style.gridArea = `card${index + 1}`;
    article.setAttribute('aria-label', place.name);

    article.innerHTML = `
      <h2>${place.name}</h2>
      <figure>
        <img
          src="${place.image}"
          alt="${place.alt}"
          width="300"
          height="200"
          loading="lazy"
        >
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button type="button" class="learn-more-btn" aria-label="Learn more about ${place.name}">
        Learn More
      </button>
    `;

    fragment.appendChild(article);
  });

  grid.appendChild(fragment);

  // ── LEARN MORE button: expand/collapse description ─────────
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.learn-more-btn');
    if (!btn) return;
    const card = btn.closest('.attraction-card');
    const p    = card?.querySelector('p');
    if (!p) return;
    const expanded = card.classList.toggle('card-expanded');
    btn.textContent = expanded ? 'Show Less' : 'Learn More';
    btn.setAttribute('aria-expanded', expanded);
  });
}

// ── VISITOR MESSAGE (localStorage) ──────────────────────────
// Uses Date.now() (milliseconds) for arithmetic.
const msgEl = document.getElementById('visitor-msg');

if (msgEl) {
  const KEY      = 'ibadanLastVisit';
  const now      = Date.now();
  const lastRaw  = localStorage.getItem(KEY);

  let message;

  if (!lastRaw) {
    // First ever visit
    message = '👋 Welcome! Let us know if you have any questions.';
  } else {
    const last    = parseInt(lastRaw, 10);
    const diffMs  = now - last;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      message = '🎉 Back so soon! Awesome!';
    } else {
      const dayWord = diffDays === 1 ? 'day' : 'days';
      message = `🗓️ You last visited ${diffDays} ${dayWord} ago.`;
    }
  }

  // Store current timestamp for next visit
  localStorage.setItem(KEY, now);

  msgEl.textContent = message;
  msgEl.classList.add('visitor-msg--visible');
}
