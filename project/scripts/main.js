// scripts/main.js
// Home page: dish-of-the-week + featured grid (first 6 cards)

import { initNav, renderFavourites } from './shared.js';
import { renderCards, openModal }    from './directory.js';
import { foods }                     from './foods.js';

initNav();
renderFavourites();

// ── Featured grid — first 6 dishes ───────────────────────────
const homeGrid = document.getElementById('home-grid');
if (homeGrid) {
  renderCards(foods.slice(0, 6), homeGrid);
}

// ── Dish of the Week ──────────────────────────────────────────
// Deterministic daily pick: day-of-year mod total dishes
const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
);
const dish = foods[dayOfYear % foods.length];

const dotwEmoji = document.getElementById('dotw-emoji');
const dotwName  = document.getElementById('dotw-name');
const dotwDesc  = document.getElementById('dotw-desc');
const dotwPrice = document.getElementById('dotw-price');
const dotwArea  = document.getElementById('dotw-area');

if (dotwEmoji) dotwEmoji.textContent = dish.emoji;
if (dotwName)  dotwName.textContent  = dish.name;
if (dotwDesc)  dotwDesc.textContent  = dish.description;
if (dotwPrice) dotwPrice.textContent = dish.price;
if (dotwArea)  dotwArea.textContent  = dish.neighbourhood;
