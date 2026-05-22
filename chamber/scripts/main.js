/* ============================================================
   Ibadan Chamber – main.js  (home page)
   Weather + Spotlights + shared nav/footer logic
   ============================================================ */
'use strict';

// ── CONFIG ───────────────────────────────────────────────────
const OWM_KEY = 'YOUR_API_KEY'; // Replace with key from openweathermap.org
const CITY_ID = '2339354';      // Ibadan, Nigeria
const UNITS   = 'metric';

// ── DOM REFS ─────────────────────────────────────────────────
const weatherBody    = document.querySelector('.weather-body');
const forecastBody   = document.querySelector('.forecast-body');
const spotlightsBody = document.querySelector('.spotlights-body');
const menuToggle     = document.getElementById('menu-toggle');
const navList        = document.getElementById('nav-list');
const themeBtn       = document.querySelector('.theme-btn');
const copyrightYr    = document.getElementById('copyright-year');
const lastModified   = document.getElementById('last-modified');

// ── FOOTER META ──────────────────────────────────────────────
if (copyrightYr)  copyrightYr.textContent  = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;

// ── DARK MODE ────────────────────────────────────────────────
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
applyTheme(localStorage.getItem('ibadanTheme') === 'dark');
themeBtn?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
  localStorage.setItem('ibadanTheme', !isDark ? 'dark' : 'light');
});

// ── MOBILE NAV ───────────────────────────────────────────────
menuToggle?.addEventListener('click', () => {
  const nav    = menuToggle.nextElementSibling;
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.textContent = isOpen ? '✕' : '☰';
});
navList?.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navList.closest('nav')?.classList.remove('open');
    if (menuToggle) { menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰'; }
  }
});

// ── WEATHER HELPERS ──────────────────────────────────────────
function weatherIcon(code) {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800)               return '☀️';
  if (code === 801)               return '🌤️';
  if (code === 802)               return '⛅';
  return '☁️';
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ── CURRENT WEATHER ──────────────────────────────────────────
async function loadCurrentWeather() {
  if (!weatherBody) return;
  if (OWM_KEY === 'YOUR_API_KEY') { renderWeatherPlaceholder(); return; }
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=${UNITS}&appid=${OWM_KEY}`);
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    const rise = new Date(d.sys.sunrise*1000).toLocaleTimeString('en-NG',{hour:'2-digit',minute:'2-digit'});
    const set  = new Date(d.sys.sunset *1000).toLocaleTimeString('en-NG',{hour:'2-digit',minute:'2-digit'});
    weatherBody.innerHTML = `
      <div class="weather-current">
        <div class="weather-icon">${weatherIcon(d.weather[0].id)}</div>
        <div>
          <div class="weather-temp">${Math.round(d.main.temp)}°C</div>
          <div class="weather-desc">${cap(d.weather[0].description)}</div>
          <div class="weather-meta">
            <span>High: ${Math.round(d.main.temp_max)}°C</span>
            <span>Low: ${Math.round(d.main.temp_min)}°C</span>
            <span>Humidity: ${d.main.humidity}%</span>
            <span>Sunrise: ${rise}</span>
            <span>Sunset: ${set}</span>
          </div>
        </div>
      </div>`;
  } catch { weatherBody.innerHTML = '<p class="weather-loading">Weather unavailable.</p>'; }
}

function renderWeatherPlaceholder() {
  if (!weatherBody) return;
  weatherBody.innerHTML = `
    <div class="weather-current">
      <div class="weather-icon">⛅</div>
      <div>
        <div class="weather-temp">32°C</div>
        <div class="weather-desc">Partly Cloudy</div>
        <div class="weather-meta">
          <span>High: 35°C</span><span>Low: 26°C</span>
          <span>Humidity: 72%</span><span>Sunrise: 6:22am</span>
          <span>Sunset: 6:48pm</span>
        </div>
      </div>
    </div>
    <p style="font-size:.72rem;color:var(--ink-muted);margin-top:.5rem;">
      ℹ️ Add your OpenWeatherMap API key in main.js for live data.
    </p>`;
}

// ── FORECAST ─────────────────────────────────────────────────
async function loadForecast() {
  if (!forecastBody) return;
  if (OWM_KEY === 'YOUR_API_KEY') { renderForecastPlaceholder(); return; }
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=${UNITS}&cnt=24&appid=${OWM_KEY}`);
    if (!res.ok) throw new Error(res.status);
    const d  = await res.json();
    const tz = d.city.timezone;
    const days = {};
    for (const item of d.list) {
      const key = new Date((item.dt+tz)*1000).toISOString().slice(0,10);
      if (!days[key]) days[key] = { max: -999, dt: item.dt };
      days[key].max = Math.max(days[key].max, Math.round(item.main.temp_max));
    }
    const entries = Object.entries(days).slice(1,4);
    forecastBody.innerHTML = entries.map(([,v]) => {
      const label = new Date((v.dt+tz)*1000).toLocaleDateString('en-NG',{weekday:'long'});
      return `<div class="forecast-row"><span class="day">${label}</span><span class="temp">${v.max}°C</span></div>`;
    }).join('');
  } catch { forecastBody.innerHTML = '<p class="weather-loading">Forecast unavailable.</p>'; }
}

function renderForecastPlaceholder() {
  if (!forecastBody) return;
  [['Tomorrow','34°C'],['Wednesday','31°C'],['Thursday','29°C']].forEach(([d,t]) => {
    forecastBody.innerHTML += `<div class="forecast-row"><span class="day">${d}</span><span class="temp">${t}</span></div>`;
  });
}

// ── SPOTLIGHTS ───────────────────────────────────────────────
async function loadSpotlights() {
  if (!spotlightsBody) return;
  try {
    const res  = await fetch('./scripts/members.json');
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const eligible = data.members.filter(m => m.membership === 'gold' || m.membership === 'silver');
    const picks    = eligible.sort(() => Math.random() - .5).slice(0, 3);

    spotlightsBody.innerHTML = picks.map(m => `
      <div class="spotlight-card">
        <div class="spotlight-logo" style="background:${m.color}">${m.initial}</div>
        <div class="spotlight-info">
          <h4>${m.name}</h4>
          <p>📞 ${m.phone}</p>
          <p>📍 ${m.address}</p>
          <p>🌐 <a href="https://${m.website}" target="_blank" rel="noopener">${m.website}</a></p>
          <span class="badge ${m.membership === 'gold' ? 'badge-gold' : 'badge-silver'}">
            ${m.membership === 'gold' ? '⭐ Gold' : '🥈 Silver'} Member
          </span>
        </div>
      </div>`).join('');
  } catch {
    spotlightsBody.innerHTML = '<p class="weather-loading">Could not load spotlights.</p>';
  }
}

// ── INIT ─────────────────────────────────────────────────────
loadCurrentWeather();
loadForecast();
loadSpotlights();
