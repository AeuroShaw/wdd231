// scripts/discover.mjs
// Discover (Culture & Tips) page — ES module
// Imports culture data from data/attractions.mjs

import { initNav } from './shared.js';
import { cultureFacts, neighbourhoods, faqs } from '../data/attractions.mjs';

initNav();

// ── Visit tracking (localStorage) ────────────────────────────
const VISITS_KEY = 'lsfg-visitCount';
const LAST_KEY   = 'lsfg-lastVisit';

function trackVisit() {
  const count    = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) + 1;
  const lastDate = localStorage.getItem(LAST_KEY);
  localStorage.setItem(VISITS_KEY, String(count));
  localStorage.setItem(LAST_KEY, new Date().toLocaleDateString('en-NG', { dateStyle: 'medium' }));

  const banner = document.getElementById('visit-banner');
  if (!banner) return;

  if (count === 1) {
    banner.innerHTML = `<span>👋</span> <span>Welcome! This is your <strong>first visit</strong> to this page.</span>`;
  } else {
    banner.innerHTML = `<span>👋</span> <span>Welcome back! You've visited this page <strong>${count} times</strong>. Last visit: ${lastDate || 'recently'}.</span>`;
  }
}

// ── Render culture fact cards ─────────────────────────────────
function renderCultureCards() {
  const grid = document.getElementById('culture-grid');
  if (!grid) return;

  grid.innerHTML = cultureFacts.map(fact => `
    <div class="culture-card">
      <div class="culture-card-icon">${fact.icon}</div>
      <h3>${fact.title}</h3>
      <p>${fact.body}</p>
    </div>`).join('');
}

// ── Render neighbourhoods table ───────────────────────────────
function renderNeighbourhoods() {
  const tbody = document.getElementById('nbhd-tbody');
  if (!tbody) return;

  tbody.innerHTML = neighbourhoods.map(n => `
    <tr>
      <td><strong>${n.name}</strong></td>
      <td>${n.specialty}</td>
    </tr>`).join('');
}

// ── Render FAQ accordion ──────────────────────────────────────
function renderFAQs() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  container.innerHTML = faqs.map((faq, i) => `
    <div class="accordion-item">
      <button class="accordion-btn" aria-expanded="false" aria-controls="faq-panel-${i}">
        ${faq.q}
      </button>
      <div class="accordion-panel" id="faq-panel-${i}" role="region">
        <p>${faq.a}</p>
      </div>
    </div>`).join('');

  // Attach accordion events
  container.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel  = btn.nextElementSibling;
      const isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

// ── Reading mode (localStorage) ──────────────────────────────
function initReadingMode() {
  const toggle = document.getElementById('reading-toggle');
  if (!toggle) return;

  const applyMode = mode => {
    if (mode === 'dark') {
      document.body.classList.add('reading-dark');
      toggle.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('reading-dark');
      toggle.textContent = '🌙 Reading Mode';
    }
  };

  applyMode(localStorage.getItem('lsfg-readingMode') || 'light');

  toggle.addEventListener('click', () => {
    const next = document.body.classList.contains('reading-dark') ? 'light' : 'dark';
    localStorage.setItem('lsfg-readingMode', next);
    applyMode(next);
  });
}

// ── Init ──────────────────────────────────────────────────────
trackVisit();
renderCultureCards();
renderNeighbourhoods();
renderFAQs();
initReadingMode();
