// scripts/main.js
// Home page: dish-of-the-week + featured grid (first 6 cards)

import { initNav, renderFavourites, saveFavourite } from './shared.js';
import { renderCards, openModal } from './directory.js';

initNav();
renderFavourites();

// ── Featured grid (home shows first 6 dishes) ─────────────────
const homeGrid = document.getElementById('home-grid');

async function loadFeatured() {
  try {
    const jsonUrl = new URL('members.json', import.meta.url).href;
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const foods = await res.json();
    // Show first 6 on home page
    renderCards(foods.slice(0, 6), homeGrid);
  } catch (err) {
    homeGrid.innerHTML = `<p class="notice">Could not load featured dishes. ${err.message}</p>`;
    console.error('loadFeatured:', err);
  }
}

// ── Dish of the Week ───────────────────────────────────────────
async function loadDishOfWeek() {
  try {
    const jsonUrl = new URL('members.json', import.meta.url).href;
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const foods = await res.json();

    // Deterministic pick: day-of-year mod total dishes
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
    );
    const dish = foods[dayOfYear % foods.length];

    document.getElementById('dotw-emoji').textContent = dish.emoji;
    document.getElementById('dotw-name').textContent  = dish.name;
    document.getElementById('dotw-desc').textContent  = dish.description;
    document.getElementById('dotw-price').textContent = dish.price;
    document.getElementById('dotw-area').textContent  = dish.neighbourhood;
  } catch (err) {
    const section = document.getElementById('dotw-section');
    if (section) section.style.display = 'none';
    console.error('loadDishOfWeek:', err);
  }
}

loadFeatured();
loadDishOfWeek();
