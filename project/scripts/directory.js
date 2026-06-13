// scripts/directory.js
// All-dishes page: fetch, render, filter, search, modal
// Also exports renderCards + openModal for use by main.js

import { initNav, renderFavourites, saveFavourite, showToast } from './shared.js';

let allFoods = [];

// ── Card renderer (exported for home page reuse) ──────────────
export function renderCards(foods, container) {
  if (!container) return;
  container.innerHTML = '';

  if (!foods.length) {
    container.innerHTML = '<p class="notice">No dishes match your search.</p>';
    return;
  }

  foods.forEach((food, i) => {
    const card = document.createElement('article');
    card.className = 'food-card';
    card.style.animationDelay = `${i * 0.045}s`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${food.name}`);

    const dots = Array.from({ length: 5 }, (_, d) =>
      `<span class="dot${d < food.spiceLevel ? ' hot' : ''}"></span>`
    ).join('');

    card.innerHTML = `
      <div class="card-emoji">${food.emoji}</div>
      <div class="card-body">
        <p class="card-category">${food.category}</p>
        <h3 class="card-name">${food.name}</h3>
        <p class="card-hood">${food.neighbourhood}</p>
        <div class="card-meta">
          <span class="card-price">${food.price}</span>
          <span class="spice-dots" aria-label="Spice level ${food.spiceLevel} of 5">${dots}</span>
          <span class="card-rating">★ ${food.rating}</span>
        </div>
      </div>`;

    card.addEventListener('click', () => openModal(food));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(food); }
    });
    container.appendChild(card);
  });
}

// ── Modal (exported for home page reuse) ──────────────────────
export function openModal(food) {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;

  const tagsHtml = food.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const dots = Array.from({ length: 5 }, (_, d) =>
    `<span class="dot${d < food.spiceLevel ? ' hot' : ''}"></span>`
  ).join('');

  backdrop.querySelector('.modal-head').innerHTML = `
    <div>
      <div class="modal-head-emoji">${food.emoji}</div>
      <h2>${food.name}</h2>
      <p>${food.category} · ${food.neighbourhood}</p>
    </div>
    <button class="modal-close" aria-label="Close modal">✕</button>`;

  backdrop.querySelector('.modal-body').innerHTML = `
    <p>${food.description}</p>
    <div class="modal-tags">${tagsHtml}</div>
    <div class="modal-details">
      <div class="detail-chip">
        <strong>Price Range</strong>
        <span>${food.price}</span>
      </div>
      <div class="detail-chip">
        <strong>Best Time</strong>
        <span>${food.bestTime}</span>
      </div>
      <div class="detail-chip">
        <strong>Spice Level</strong>
        <span class="spice-dots" style="display:inline-flex;gap:4px;">${dots}</span>
      </div>
      <div class="detail-chip">
        <strong>Rating</strong>
        <span>★ ${food.rating} / 5</span>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn" id="modal-save-btn">♥ Save Favourite</button>
      <button class="btn btn-ghost modal-close-btn">Close</button>
    </div>`;

  backdrop.classList.add('open');
  backdrop.querySelector('.modal-close').focus();

  backdrop.querySelector('#modal-save-btn').addEventListener('click', () => {
    saveFavourite(food, () => renderFavourites());
  });
  backdrop.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn =>
    btn.addEventListener('click', closeModal)
  );
}

export function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// Global modal-close handlers
document.addEventListener('click', e => {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop && e.target === backdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Directory page init ────────────────────────────────────────
const dirGrid = document.getElementById('dir-grid');
if (dirGrid) {
  initNav();
  renderFavourites();

  const searchInput  = document.getElementById('search-input');
  const resultCount  = document.getElementById('result-count');
  let timeFilter = 'all';

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const filtered = allFoods.filter(f => {
      const matchQ = !q ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.neighbourhood.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q));
      const matchT = timeFilter === 'all' || f.bestTime === timeFilter;
      return matchQ && matchT;
    });
    renderCards(filtered, dirGrid);
    if (resultCount) resultCount.textContent = `${filtered.length} dish${filtered.length !== 1 ? 'es' : ''} found`;
  }

  async function loadAllDishes() {
    try {
      const jsonUrl = new URL('members.json', import.meta.url).href;
      const res = await fetch(jsonUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allFoods = await res.json();
      renderCards(allFoods, dirGrid);
      if (resultCount) resultCount.textContent = `${allFoods.length} dishes found`;
    } catch (err) {
      dirGrid.innerHTML = `<p class="notice">Could not load dishes. ${err.message}</p>`;
      console.error('loadAllDishes:', err);
    }
  }

  searchInput?.addEventListener('input', applyFilters);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeFilter = btn.dataset.time;
      applyFilters();
    });
  });

  loadAllDishes();
}
