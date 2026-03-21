//  MAPEO DE ICONOS Y DESCRIPCIONES

function getIconAndDesc(owmIcon, description) {
  const map = {
    "01d": "☀️",  "01n": "🌙",
    "02d": "🌤️", "02n": "🌤️",
    "03d": "⛅",  "03n": "⛅",
    "04d": "☁️",  "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌦️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️",  "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️",
  };
  const ico = map[owmIcon] || "🌡️";
  // Capitaliza primera letra de la descripción
  const desc = description.charAt(0).toUpperCase() + description.slice(1);
  return [ico, desc];
}

//  FONDO DINÁMICO

function updateSky(owmIcon, weatherId) {
  const sky    = document.getElementById("sky");
  const stars  = document.getElementById("stars");
  const clouds = document.getElementById("clouds");
  const rain   = document.getElementById("rain");
  const snow   = document.getElementById("snow");

  const isDay = owmIcon && owmIcon.endsWith("d");
  sky.className = "sky";
  stars.className = "stars" + (isDay ? " hidden" : "");
  clouds.className = "clouds";
  rain.className = "rain-container";
  snow.className = "snow-container";

  const h = new Date().getHours();
  if (isDay) {
    if      (h >= 6  && h < 9)  sky.classList.add("dawn");
    else if (h >= 9  && h < 18) sky.classList.add("day");
    else if (h >= 18 && h < 21) sky.classList.add("dusk");
  }

  // Nubes: id 801–804
  if (weatherId >= 801 && weatherId <= 804) clouds.classList.add("visible");
  // Lluvia: id 300–321, 500–531, 200–232
  if ((weatherId >= 200 && weatherId <= 232) ||
      (weatherId >= 300 && weatherId <= 321) ||
      (weatherId >= 500 && weatherId <= 531)) {
    sky.classList.add("rain");
    buildRain();
    rain.classList.add("visible");
  }
  // Nieve: id 600–622
  if (weatherId >= 600 && weatherId <= 622) {
    sky.classList.add("snow");
    buildSnow();
    snow.classList.add("visible");
  }
}

function buildRain() {
  const c = document.getElementById("rain");
  if (c.children.length) return;
  for (let i = 0; i < 60; i++) {
    const d = document.createElement("div");
    d.className = "drop";
    d.style.left = Math.random() * 100 + "vw";
    d.style.height = (10 + Math.random() * 20) + "px";
    d.style.animationDuration = (0.5 + Math.random() * 0.8) + "s";
    d.style.animationDelay = (-Math.random() * 2) + "s";
    c.appendChild(d);
  }
}

function buildSnow() {
  const c = document.getElementById("snow");
  if (c.children.length) return;
  for (let i = 0; i < 40; i++) {
    const f = document.createElement("div");
    f.className = "flake";
    f.style.left = Math.random() * 100 + "vw";
    f.style.animationDuration = (3 + Math.random() * 4) + "s";
    f.style.animationDelay = (-Math.random() * 5) + "s";
    const size = (2 + Math.random() * 4) + "px";
    f.style.width = f.style.height = size;
    c.appendChild(f);
  }
}


//  UI HELPERS

function showLoader() {
  document.getElementById("statusArea").innerHTML =
    '<div class="status"><div class="loader"></div>Obteniendo datos...</div>';
  document.getElementById("mainCard").classList.remove("visible");
  document.getElementById("forecastCard").classList.remove("visible");
}

function showError(msg) {
  document.getElementById("statusArea").innerHTML =
    `<div class="error-msg">⚠️ ${msg}</div>`;
}

function clearStatus() {
  document.getElementById("statusArea").innerHTML = "";
}


//  RENDER CLIMA ACTUAL

function showWeather(data) {
  if (data.cod !== 200) {
    showError("Ciudad no encontrada. Intenta con otro nombre.");
    return;
  }

  const icon    = data.weather[0].icon;
  const id      = data.weather[0].id;
  const [ico, desc] = getIconAndDesc(icon, data.weather[0].description);
  const temp    = Math.round(data.main.temp);
  const feels   = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const wind    = Math.round(data.wind.speed * 3.6); // m/s → km/h
  const windDeg = data.wind.deg || 0;
  const country = data.sys.country || "";
  const city    = data.name;
  const isDay   = icon.endsWith("d");

  updateSky(icon, id);
  clearStatus();

  const timeStr = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const dirs = ["N","NE","E","SE","S","SO","O","NO"];
  const windDir = dirs[Math.round(windDeg / 45) % 8];

  const card = document.getElementById("mainCard");
  card.innerHTML = `
    <div class="city-row">
      <div>
        <div class="city-name">${city}</div>
        <div class="country-code">${country}</div>
        <div class="local-time">⏱ ${timeStr}</div>
      </div>
      <div class="weather-icon">${ico}</div>
    </div>
    <div class="temp-row">
      <div class="temp-big">${temp}</div>
      <div class="temp-unit">°C</div>
    </div>
    <div class="feels-like">Sensación térmica ${feels}°C</div>
    <div class="description">${desc}</div>
    <div class="divider"></div>
    <div class="stats">
      <div class="stat">
        <div class="stat-icon">💧</div>
        <div class="stat-val">${humidity}%</div>
        <div class="stat-lbl">Humedad</div>
      </div>
      <div class="stat">
        <div class="stat-icon">💨</div>
        <div class="stat-val">${wind} km/h</div>
        <div class="stat-lbl">Viento ${windDir}</div>
      </div>
      <div class="stat">
        <div class="stat-icon">${isDay ? "🌅" : "🌙"}</div>
        <div class="stat-val">${isDay ? "Día" : "Noche"}</div>
        <div class="stat-lbl">Momento</div>
      </div>
    </div>
  `;
  setTimeout(() => card.classList.add("visible"), 50);
}


// PRONÓSTICO 5 DÍAS

function showForecast(data) {
  if (!data || data.cod !== "200") return;

  // OWM /forecast devuelve cada 3h — cogemos un dato por día (al mediodía)
  const days = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    const hour = parseInt(item.dt_txt.split(" ")[1]);
    if (!days[date] || Math.abs(hour - 12) < Math.abs(parseInt(days[date].dt_txt.split(" ")[1]) - 12)) {
      days[date] = item;
    }
  });

  const dayNames = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const items = Object.values(days).slice(0, 7).map((item, i) => {
    const d = new Date(item.dt_txt);
    const label = i === 0 ? "Hoy" : i === 1 ? "Mañana" : dayNames[d.getDay()];
    const [ico] = getIconAndDesc(item.weather[0].icon, item.weather[0].description);
    const hi = Math.round(item.main.temp_max);
    const lo = Math.round(item.main.temp_min);
    return `
      <div class="forecast-item">
        <div class="forecast-day">${label}</div>
        <div class="forecast-ico">${ico}</div>
        <div class="forecast-hi">${hi}°</div>
        <div class="forecast-lo">${lo}°</div>
      </div>`;
  }).join("");

  const fc = document.getElementById("forecastCard");
  fc.innerHTML = `
    <div class="forecast-title">Pronóstico próximos días</div>
    <div class="forecast-row">${items}</div>
  `;
  setTimeout(() => fc.classList.add("visible"), 150);
}

//  BUSCAR POR NOMBRE DE CIUDAD (tu lógica original)

function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;
  showLoader();

  fetch(`/api/weather?city=${encodeURIComponent(city)}&type=weather`)
    .then(res => res.json())
    .then(data => showWeather(data))
    .catch(() => showError("Error al obtener datos. Comprueba tu conexión."));

  fetch(`/api/weather?city=${encodeURIComponent(city)}&type=forecast`)
    .then(res => res.json())
    .then(data => showForecast(data))
    .catch(() => {});
}


//  GEOLOCALIZACIÓN AUTOMÁTICA

function autoLocate() {
  if (!navigator.geolocation) {
    showError("Geolocalización no disponible en tu navegador.");
    return;
  }
  const btn = document.getElementById("geoBtn");
  btn.textContent = "…";
  showLoader();

  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg> Mi ubicación`;

      const { latitude: lat, longitude: lon } = pos.coords;

      fetch(`/api/weather?lat=${lat}&lon=${lon}&type=weather`)
        .then(res => res.json())
        .then(data => showWeather(data))
        .catch(() => showError("Error al obtener datos."));

      fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`)
        .then(res => res.json())
        .then(data => showForecast(data))
        .catch(() => {});
    },
    () => {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg> Mi ubicación`;
      showError("Permiso de ubicación denegado. Busca tu ciudad manualmente.");
    }
  );
}

//  INICIO AUTOMÁTICO

window.addEventListener("load", autoLocate);
