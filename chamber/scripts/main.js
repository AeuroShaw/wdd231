/* ============================================================
   Ibadan Chamber – main.js  (home page only)
   Weather via OpenWeatherMap API + Member Spotlights
   Nav/footer handled by shared.js
   ============================================================ */
'use strict';

const OWM_KEY = '201985cb7ff18fe73f0c9727b4702584';
const CITY_ID = '2339354';   // Ibadan, Nigeria
const UNITS   = 'metric';

const weatherBody    = document.querySelector('.weather-body');
const forecastBody   = document.querySelector('.forecast-body');
const spotlightsBody = document.querySelector('.spotlights-body');

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
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&units=${UNITS}&appid=${OWM_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    const rise = new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    const set  = new Date(d.sys.sunset  * 1000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
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
  } catch {
    weatherBody.innerHTML = '<p class="weather-loading">Weather data unavailable.</p>';
  }
}

// ── 3-DAY FORECAST ───────────────────────────────────────────
async function loadForecast() {
  if (!forecastBody) return;
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&units=${UNITS}&appid=${OWM_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const byDay = {};
    data.list.forEach(item => {
      const dateKey = new Date(item.dt * 1000).toISOString().slice(0, 10);
      if (!byDay[dateKey]) byDay[dateKey] = { max: -Infinity, dt: item.dt };
      const t = Math.round(item.main.temp_max ?? item.main.temp);
      if (t > byDay[dateKey].max) byDay[dateKey].max = t;
    });

    const today   = new Date().toISOString().slice(0, 10);
    const entries = Object.entries(byDay)
      .filter(([key]) => key > today)
      .slice(0, 3);

    if (entries.length === 0) throw new Error('No forecast data');

    forecastBody.innerHTML = entries.map(([, v]) => {
      const label = new Date(v.dt * 1000).toLocaleDateString('en-NG', { weekday: 'long' });
      return `<div class="forecast-row">
                <span class="day">${label}</span>
                <span class="temp">${v.max}°C</span>
              </div>`;
    }).join('');
  } catch {
    // Fallback: real day names from Date, never hardcoded strings
    const today = new Date();
    forecastBody.innerHTML = [1, 2, 3].map(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const label = d.toLocaleDateString('en-NG', { weekday: 'long' });
      return `<div class="forecast-row">
                <span class="day">${label}</span>
                <span class="temp">—°C</span>
              </div>`;
    }).join('');
  }
}

// ── SPOTLIGHTS ───────────────────────────────────────────────
async function loadSpotlights() {
  if (!spotlightsBody) return;
  try {
    const res  = await fetch('./scripts/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const eligible = data.members.filter(m =>
      m.membership === 'gold' || m.membership === 'silver'
    );
    const picks = eligible.sort(() => Math.random() - 0.5).slice(0, 3);
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
    spotlightsBody.innerHTML = '<p class="weather-loading">Could not load member spotlights.</p>';
  }
}

loadCurrentWeather();
loadForecast();
loadSpotlights();
