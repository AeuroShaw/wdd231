/* ============================================================
   Ibadan Chamber of Commerce – main.js
   Weather: OpenWeatherMap API  |  Spotlights: members.json
   ============================================================ */

// ── CONFIG ──────────────────────────────────────────────────
// Replace YOUR_API_KEY with a real OpenWeatherMap API key.
// Get a free key at https://openweathermap.org/appid
const OWM_KEY  = 'YOUR_API_KEY';
const CITY_ID  = '2339354'; // Ibadan, Nigeria OpenWeatherMap city ID
const UNITS    = 'metric';  // Celsius

// ── DOM REFS ────────────────────────────────────────────────
const weatherBody    = document.querySelector('.weather-body');
const forecastBody   = document.querySelector('.forecast-body');
const spotlightsBody = document.querySelector('.spotlights-body');

// ── WEATHER ICONS (emoji map) ────────────────────────────────
function weatherIcon(code) {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800)               return '☀️';
  if (code === 801)               return '🌤️';
  if (code === 802)               return '⛅';
  if (code === 803 || code === 804) return '☁️';
  return '🌡️';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function dayName(dtUnix, offset = 0) {
  // Convert Unix timestamp + timezone offset to local day name
  const date = new Date((dtUnix + offset) * 1000);
  return date.toLocaleDateString('en-NG', { weekday: 'long' });
}

// ── CURRENT WEATHER ──────────────────────────────────────────
async function loadCurrentWeather() {
  weatherBody.innerHTML = '<p class="weather-loading">Loading weather…</p>';

  // If no API key, show placeholder
  if (OWM_KEY === 'YOUR_API_KEY') {
    renderWeatherPlaceholder();
    return;
  }

  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=${UNITS}&appid=${OWM_KEY}`
    );
    if (!res.ok) throw new Error('Weather fetch failed');
    const d    = await res.json();

    const icon = weatherIcon(d.weather[0].id);
    const desc = capitalize(d.weather[0].description);
    const temp = Math.round(d.main.temp);
    const hi   = Math.round(d.main.temp_max);
    const lo   = Math.round(d.main.temp_min);
    const hum  = d.main.humidity;
    const rise = new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    const set  = new Date(d.sys.sunset  * 1000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

    weatherBody.innerHTML = `
      <div class="weather-current">
        <div class="weather-icon">${icon}</div>
        <div class="weather-details">
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${desc}</div>
          <div class="weather-meta">
            <span>High: ${hi}°C</span>
            <span>Low: ${lo}°C</span>
            <span>Humidity: ${hum}%</span>
            <span>Sunrise: ${rise}</span>
            <span>Sunset: ${set}</span>
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    weatherBody.innerHTML = '<p class="weather-loading">Weather data unavailable.</p>';
  }
}

// ── 3-DAY FORECAST ───────────────────────────────────────────
async function loadForecast() {
  forecastBody.innerHTML = '<p class="weather-loading">Loading forecast…</p>';

  if (OWM_KEY === 'YOUR_API_KEY') {
    renderForecastPlaceholder();
    return;
  }

  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=${UNITS}&cnt=24&appid=${OWM_KEY}`
    );
    if (!res.ok) throw new Error('Forecast fetch failed');
    const d    = await res.json();
    const tz   = d.city.timezone;

    // Group by day (skip today = index 0)
    const days = {};
    for (const item of d.list) {
      const date = new Date((item.dt + tz) * 1000);
      const key  = date.toISOString().slice(0, 10);
      if (!days[key]) days[key] = { max: -999, dt: item.dt };
      days[key].max = Math.max(days[key].max, Math.round(item.main.temp_max));
    }

    const entries = Object.entries(days).slice(1, 4); // next 3 days
    forecastBody.innerHTML = entries.map(([, v]) =>
      `<div class="forecast-row">
         <span class="day">${dayName(v.dt, tz)}</span>
         <span class="temp">${v.max}°C</span>
       </div>`
    ).join('');
  } catch (e) {
    forecastBody.innerHTML = '<p class="weather-loading">Forecast unavailable.</p>';
  }
}

// ── PLACEHOLDERS (no API key) ─────────────────────────────────
function renderWeatherPlaceholder() {
  weatherBody.innerHTML = `
    <div class="weather-current">
      <div class="weather-icon">⛅</div>
      <div class="weather-details">
        <div class="weather-temp">32°C</div>
        <div class="weather-desc">Partly Cloudy</div>
        <div class="weather-meta">
          <span>High: 35°C</span>
          <span>Low: 26°C</span>
          <span>Humidity: 72%</span>
          <span>Sunrise: 6:22am</span>
          <span>Sunset: 6:48pm</span>
        </div>
      </div>
    </div>
    <p style="font-size:.75rem;color:var(--text-muted);margin-top:.5rem;">
      ℹ️ Add your OpenWeatherMap API key in main.js to see live data.
    </p>
  `;
}

function renderForecastPlaceholder() {
  const days = [
    { label: 'Tomorrow', temp: '34°C' },
    { label: 'Wednesday', temp: '31°C' },
    { label: 'Thursday',  temp: '29°C' }
  ];
  forecastBody.innerHTML = days.map(d =>
    `<div class="forecast-row"><span class="day">${d.label}</span><span class="temp">${d.temp}</span></div>`
  ).join('');
}

// ── SPOTLIGHTS ───────────────────────────────────────────────
async function loadSpotlights() {
  try {
    const res     = await fetch('./scripts/members.json');
    const data    = await res.json();

    // Filter gold + silver only
    const eligible = data.members.filter(m =>
      m.membership === 'gold' || m.membership === 'silver'
    );

    // Shuffle and pick 3
    const shuffled = eligible.sort(() => Math.random() - .5).slice(0, 3);

    spotlightsBody.innerHTML = shuffled.map(m => `
      <div class="spotlight-card">
        <div class="spotlight-logo" style="background:${m.color}">${m.initial}</div>
        <div class="spotlight-info">
          <h4>${m.name}</h4>
          <p>📞 ${m.phone}</p>
          <p>📍 ${m.address}</p>
          <p>🌐 <a href="https://${m.website}" target="_blank" rel="noopener">${m.website}</a></p>
          <span class="membership-badge badge-${m.membership}">
            ${m.membership === 'gold' ? '⭐ Gold Member' : '🥈 Silver Member'}
          </span>
        </div>
      </div>
    `).join('');
  } catch (e) {
    spotlightsBody.innerHTML = '<p class="weather-loading">Could not load member spotlights.</p>';
  }
}

// ── MOBILE NAV TOGGLE ────────────────────────────────────────
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('nav ul');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => {
    navList.classList.toggle('nav-hidden');
  });
}

// ── LAST MODIFIED ────────────────────────────────────────────
const modSpan = document.getElementById('last-modified');
if (modSpan) {
  modSpan.textContent = document.lastModified;
}

// ── INIT ─────────────────────────────────────────────────────
loadCurrentWeather();
loadForecast();
loadSpotlights();
