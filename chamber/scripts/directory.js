/* ============================================================
   Ibadan Chamber of Commerce – directory.js
   Responsibilities:
     • Fetch members.json and render member cards
     • Grid ↔ List view toggle
     • Mobile nav toggle
     • Dark mode toggle (persists via localStorage)
     • Footer: copyright year + last modified
   ============================================================ */

'use strict';

// ── DOM REFS ──────────────────────────────────────────────────
const container    = document.getElementById('members-container');
const memberCount  = document.getElementById('member-count');
const btnGrid      = document.getElementById('btn-grid');
const btnList      = document.getElementById('btn-list');
const menuToggle   = document.getElementById('menu-toggle');
const navList      = document.getElementById('nav-list');
const copyrightYr  = document.getElementById('copyright-year');
const lastModified = document.getElementById('last-modified');

// ── FOOTER META ───────────────────────────────────────────────
if (copyrightYr)  copyrightYr.textContent  = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

// ── MOBILE NAV TOGGLE ─────────────────────────────────────────
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const nav    = menuToggle.nextElementSibling;  // <nav>
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.textContent = isOpen ? '✕' : '☰';
  });
}

// Close nav when a link is clicked (mobile)
navList?.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navList.closest('nav')?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  }
});

// ── VIEW TOGGLE ───────────────────────────────────────────────
function setView(view) {
  container.classList.remove('grid-view', 'list-view');
  container.classList.add(`${view}-view`);
  btnGrid.classList.toggle('active', view === 'grid');
  btnList.classList.toggle('active', view === 'list');
  localStorage.setItem('ibadanDirView', view);
  // Re-trigger stagger animations
  container.style.opacity = '0';
  requestAnimationFrame(() => {
    container.style.opacity = '1';
  });
}

// Restore saved view
const savedView = localStorage.getItem('ibadanDirView') || 'grid';
setView(savedView);

btnGrid?.addEventListener('click', () => setView('grid'));
btnList?.addEventListener('click', () => setView('list'));

// ── SVG LOGO GENERATOR ────────────────────────────────────────
/**
 * Generates an inline SVG data URI as a CSS background, used as
 * the company logo placeholder. No external image files needed.
 * Each company gets a unique geometric pattern based on its ID.
 */
function buildLogoSVG(initial, bgColor, id) {
  // Pick a subtle geometric overlay pattern based on id mod 4
  const patterns = [
    // Diagonal lines
    `<line x1='0' y1='90' x2='90' y2='0' stroke='rgba(255,255,255,0.12)' stroke-width='8'/>
     <line x1='0' y1='60' x2='60' y2='0' stroke='rgba(255,255,255,0.08)' stroke-width='6'/>`,
    // Concentric circles
    `<circle cx='45' cy='45' r='35' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='6'/>
     <circle cx='45' cy='45' r='20' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='4'/>`,
    // Corner triangles
    `<polygon points='0,0 30,0 0,30' fill='rgba(255,255,255,0.1)'/>
     <polygon points='90,90 60,90 90,60' fill='rgba(255,255,255,0.1)'/>`,
    // Cross hatch
    `<line x1='45' y1='0' x2='45' y2='90' stroke='rgba(255,255,255,0.1)' stroke-width='5'/>
     <line x1='0' y1='45' x2='90' y2='45' stroke='rgba(255,255,255,0.1)' stroke-width='5'/>`,
  ];

  const pattern = patterns[id % patterns.length];

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
  <rect width="90" height="90" fill="${bgColor}"/>
  <rect width="90" height="90" fill="url(#grad${id})"/>
  <defs>
    <linearGradient id="grad${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
    </linearGradient>
  </defs>
  ${pattern}
  <text
    x="45" y="55"
    font-family="Georgia, 'Playfair Display', serif"
    font-size="32"
    font-weight="900"
    text-anchor="middle"
    fill="rgba(255,255,255,0.95)"
    letter-spacing="1"
  >${initial}</text>
</svg>`.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ── MEMBERSHIP BADGE ─────────────────────────────────────────
function badgeHTML(membership) {
  const map = {
    gold:       { cls: 'badge-gold',        icon: '⭐', label: 'Gold Member' },
    silver:     { cls: 'badge-silver',      icon: '🥈', label: 'Silver Member' },
    nonprofit:  { cls: 'badge-nonprofit',   icon: '🌿', label: 'Non-Profit' },
  };
  const b = map[membership] || { cls: 'badge-silver', icon: '•', label: membership };
  return `<span class="badge ${b.cls}" aria-label="${b.label}">${b.icon} ${b.label}</span>`;
}

// ── RENDER A SINGLE CARD ──────────────────────────────────────
function renderCard(member) {
  const logoSrc = buildLogoSVG(member.initial, member.color, member.id);

  const card = document.createElement('article');
  card.className = 'member-card';
  card.setAttribute('aria-label', `${member.name}, ${member.membership} member`);

  card.innerHTML = `
    <div class="card-logo-wrap">
      <img
        class="card-logo"
        src="${logoSrc}"
        alt="${member.name} logo"
        width="80"
        height="80"
        loading="lazy"
        style="border-radius:var(--radius); background:${member.color};"
      />
    </div>
    <div class="card-body">
      <h3 class="card-name">${member.name}</h3>
      <p class="card-tagline">${member.tagline}</p>
      <hr class="card-divider" />
      <p class="card-detail">
        <span class="icon" aria-hidden="true">📞</span>
        <span>${member.phone}</span>
      </p>
      <p class="card-detail hide-list">
        <span class="icon" aria-hidden="true">📍</span>
        <span>${member.address}</span>
      </p>
      <p class="card-detail">
        <span class="icon" aria-hidden="true">🌐</span>
        <a href="https://${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a>
      </p>
    </div>
    <div class="card-footer">
      ${badgeHTML(member.membership)}
    </div>
  `;

  return card;
}

// ── FETCH + RENDER ────────────────────────────────────────────
async function loadDirectory() {
  container.innerHTML = `
    <div class="loading-msg" style="grid-column:1/-1">
      <span>Loading member directory…</span>
    </div>`;

  try {
    const res  = await fetch('./scripts/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const members = data.members;

    // Sort alphabetically by name
    members.sort((a, b) => a.name.localeCompare(b.name));

    // Update count
    if (memberCount) {
      memberCount.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;
    }

    // Clear and append cards with staggered animation delay
    container.innerHTML = '';
    members.forEach((member, i) => {
      const card = renderCard(member);
      card.style.animationDelay = `${i * 0.04}s`;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Directory load error:', err);
    container.innerHTML = `
      <div class="loading-msg" style="grid-column:1/-1">
        <span>⚠️ Could not load member data. Please try again later.</span>
      </div>`;
    if (memberCount) memberCount.textContent = '—';
  }
}

// ── INIT ──────────────────────────────────────────────────────
loadDirectory();
