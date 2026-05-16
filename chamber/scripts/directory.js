const themeBtn = document.getElementById('theme-btn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark-mode');

themeBtn?.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

const menuToggle = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

menuToggle?.addEventListener('click', () => {
  navList.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', navList.classList.contains('open'));
});

const yearEl = document.getElementById('copyright-year');
const modEl = document.getElementById('last-modified');

if (yearEl) yearEl.textContent = new Date().getFullYear();
if (modEl) modEl.textContent = document.lastModified;

const container = document.getElementById('members-container');
const gridBtn = document.getElementById('btn-grid');
const listBtn = document.getElementById('btn-list');

let currentView = localStorage.getItem('directory-view') || 'grid';
let membersData = [];

function setView(view) {
  currentView = view;
  localStorage.setItem('directory-view', view);
  container.className = view === 'grid' ? 'grid-view' : 'list-view';
  gridBtn.classList.toggle('active', view === 'grid');
  listBtn.classList.toggle('active', view === 'list');
  if (membersData.length) renderMembers(membersData);
}

gridBtn?.addEventListener('click', () => setView('grid'));
listBtn?.addEventListener('click', () => setView('list'));

function badgeLabel(level) {
  switch (level) {
    case 3: return { cls: 'badge-3', text: '★ Gold Member' };
    case 2: return { cls: 'badge-2', text: '◆ Silver Member' };
    default: return { cls: 'badge-1', text: 'Member' };
  }
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function buildCard(m) {
  const badge = badgeLabel(m.membershipLevel);
  return `
    <article class="member-card" aria-label="${m.name}">
      <div class="card-header">
        <div class="card-logo" aria-hidden="true">${initials(m.name)}</div>
        <div class="card-name-wrap">
          <div class="card-name">${m.name}</div>
          <div class="card-tagline">${m.tagline}</div>
        </div>
      </div>
      <div class="card-body">
        <p><strong>Address:</strong> ${m.address}</p>
        <p><strong>Phone:</strong> <a href="tel:${m.phone}">${m.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${m.email}">${m.email}</a></p>
        <p><strong>Website:</strong> <a href="${m.website}" target="_blank" rel="noopener">${m.website.replace('https://', '')}</a></p>
      </div>
      <div class="card-footer">
        <span class="card-category">${m.category}</span>
        <span class="membership-badge ${badge.cls}">${badge.text}</span>
      </div>
    </article>`;
}

function buildListItem(m) {
  const badge = badgeLabel(m.membershipLevel);
  return `
    <div class="member-list-item">
      <div class="list-logo" aria-hidden="true">${initials(m.name)}</div>
      <div class="list-details">
        <div class="list-name">${m.name}</div>
        <div class="list-meta">${m.phone} &nbsp;|&nbsp; <a href="${m.website}" target="_blank" rel="noopener">${m.website.replace('https://', '')}</a></div>
      </div>
      <div class="list-badge">
        <span class="membership-badge ${badge.cls}">${badge.text}</span>
      </div>
    </div>`;
}

function renderMembers(members) {
  const html = members.map(m =>
    currentView === 'grid' ? buildCard(m) : buildListItem(m)
  ).join('');
  container.innerHTML = html;

  const countEl = document.getElementById('member-count');
  if (countEl) countEl.textContent = `${members.length} members`;
}

async function loadMembers() {
  container.innerHTML = `
    <div class="loading" style="grid-column:1/-1">
      <div class="loading-spinner"></div>
      Loading members…
    </div>`;

  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    membersData = await res.json();
    setView(currentView);
  } catch (err) {
    container.innerHTML = `<p class="loading" style="color:var(--primary)">Failed to load member data. Please try again later.</p>`;
    console.error('Members fetch error:', err);
  }
}

loadMembers();
