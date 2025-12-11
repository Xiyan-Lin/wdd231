// Use ES module so we can keep code organized (ensure <script type="module"> in HTML)
const API_KEY = "9c491ccf419f68678e5f093b77b52dd7"; // 
// Option A: 使用城市名稱（可改成你選的城市）
// const CITY = "Taipei,tw";
// Option B: 使用經緯度（更精確）
const LAT = 25.0330;
const LON = 121.5654;

// DOM nodes
const weatherCurrentEl = document.getElementById("weather-current");
const weatherForecastEl = document.getElementById("weather-forecast");
const spotlightContainer = document.getElementById("spotlight-container");
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");

// toggle mobile nav
menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("open");
});

/* -------- Weather: OpenWeatherMap (One Call 3.0/2.5 compatibility) --------
   We'll call One Call (Current + Daily). Replace API_KEY with your key.
   Docs: https://openweathermap.org/api/one-call-3 (may require paid tier for 3.0)
   Alternative: use current + forecast endpoints separately for free tiers.
------------------------------------------------------------------------- */
async function fetchWeather() {
  try {
    // Example using One Call (exclude minutely,hourly,alerts). If you prefer city name,
    // you can use current weather + 3-day forecast with different endpoints.
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed: " + res.status);
    const data = await res.json();

    // Current
    const temp = Math.round(data.current.temp);
    const desc = data.current.weather && data.current.weather[0] ? data.current.weather[0].description : "";
    const icon = data.current.weather && data.current.weather[0] ? data.current.weather[0].icon : "";

    weatherCurrentEl.innerHTML = `
      <div class="current-top">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
        <div>
          <p class="temp">${temp}°C</p>
          <p class="desc">${desc}</p>
          <p class="location">Your City</p>
        </div>
      </div>
    `;

    // Forecast: display next 3 days (skip today index 0)
    weatherForecastEl.innerHTML = "";
    const days = data.daily.slice(1, 4); // next 3 days
    days.forEach(d => {
      const dTemp = Math.round(d.temp.day);
      const dDesc = d.weather && d.weather[0] ? d.weather[0].main : "";
      const dIcon = d.weather && d.weather[0] ? d.weather[0].icon : "";
      const date = new Date(d.dt * 1000);
      const dayName = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p class="f-day">${dayName}</p>
        <img src="https://openweathermap.org/img/wn/${dIcon}.png" alt="${dDesc}">
        <p class="f-temp">${dTemp}°C</p>
        <p class="f-desc">${dDesc}</p>
      `;
      weatherForecastEl.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    weatherCurrentEl.innerHTML = `<p class="error">Unable to load weather.</p>`;
    weatherForecastEl.innerHTML = "";
  }
}

/* -------- Spotlights: load data/members.json, filter by membership 2 or 3 (silver/gold), pick 2-3 random -------- */
async function loadSpotlights() {
  try {
    const res = await fetch("data/members.json");
    if (!res.ok) throw new Error("members.json load failed");
    const members = await res.json();

    // filter silver (2) or gold (3)
    const eligible = members.filter(m => m.membership === 2 || m.membership === 3);

    // choose random 2 or 3
    const count = Math.min(eligible.length, Math.random() < 0.6 ? 2 : 3);
    const chosen = [];
    const pool = [...eligible];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      chosen.push(pool.splice(idx, 1)[0]);
    }

    // render
    spotlightContainer.innerHTML = "";
    chosen.forEach(m => {
      const card = document.createElement("div");
      card.className = "spotlight-card";
      card.innerHTML = `
        <img class="spot-logo" src="images/${m.image}" alt="${m.name}">
        <div class="spot-info">
          <h4>${m.name}</h4>
          <p class="muted">${m.address}</p>
          <p>${m.phone}</p>
          <p><a href="${m.url}" target="_blank" rel="noopener">Visit Website</a></p>
          <p class="membership ${m.membership === 3 ? 'gold' : 'silver'}">${m.membership === 3 ? 'Gold Member' : 'Silver Member'}</p>
        </div>
      `;
      spotlightContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    spotlightContainer.innerHTML = `<p class="error">Unable to load spotlights.</p>`;
  }
}

/* init */
document.addEventListener("DOMContentLoaded", () => {
  // Load weather only if API_KEY is set (basic check)
  if (API_KEY && API_KEY !== "") {
    fetchWeather();
  } else {
    // show hint to developer
    weatherCurrentEl.innerHTML = `<p class="hint">Insert OpenWeatherMap API key in scripts/home.js to display weather.</p>`;
  }

  loadSpotlights();
});
