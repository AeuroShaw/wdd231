// scripts/shared.js
// Handles: hamburger nav, wayfinding, toast notifications
// Loaded on every page

export function initNav() {
  const toggle  = document.getElementById('menu-toggle');
  const navList = document.querySelector('nav ul');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is tapped (mobile)
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Wayfinding: mark current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current) link.setAttribute('aria-current', 'page');
  });
}

export function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Favourites helpers (localStorage)
const FAVS_KEY = 'lsfg-favourites';

export function getFavourites() {
  try { return JSON.parse(localStorage.getItem(FAVS_KEY)) || []; }
  catch { return []; }
}

export function saveFavourite(food, onSave) {
  const favs = getFavourites();
  if (favs.find(f => f.id === food.id)) {
    showToast('Already in your favourites!');
    return;
  }
  favs.push({ id: food.id, name: food.name, emoji: food.emoji });
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  showToast(`${food.emoji} ${food.name} saved!`);
  if (typeof onSave === 'function') onSave();
}

export function renderFavourites() {
  const list = document.getElementById('fav-list');
  if (!list) return;
  const favs = getFavourites();
  list.innerHTML = favs.length
    ? favs.map(f => `<span class="fav-chip">${f.emoji} ${f.name}</span>`).join('')
    : '<span style="font-size:.8rem;color:var(--brown);opacity:.65">None saved yet — click a dish to save.</span>';
}
