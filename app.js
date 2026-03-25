// =============================================
//  MAPEO CÓDIGOS WMO → ICONO + DESCRIPCIÓN
// =============================================
const WMO = {
  0:  ['☀️','Despejado'],
  1:  ['🌤️','Mayormente despejado'],
  2:  ['⛅','Parcialmente nublado'],
  3:  ['☁️','Nublado'],
  45: ['🌫️','Niebla'],
  48: ['🌫️','Niebla con escarcha'],
  51: ['🌦️','Llovizna ligera'],
  53: ['🌦️','Llovizna moderada'],
  55: ['🌧️','Llovizna intensa'],
  61: ['🌧️','Lluvia ligera'],
  63: ['🌧️','Lluvia moderada'],
  65: ['🌧️','Lluvia intensa'],
  71: ['🌨️','Nevada ligera'],
  73: ['🌨️','Nevada moderada'],
  75: ['❄️','Nevada intensa'],
  77: ['🌨️','Granizo'],
  80: ['🌦️','Chubascos ligeros'],
  81: ['🌧️','Chubascos moderados'],
  82: ['⛈️','Chubascos fuertes'],
  85: ['🌨️','Chubascos de nieve'],
  95: ['⛈️','Tormenta'],
  96: ['⛈️','Tormenta con granizo'],
  99: ['⛈️','Tormenta severa'],
};

function getWMO(code, isDay) {
  if (code === 0){
    return isDay ? ['☀️','Despejado'] : ['🌙','Despejado'];
  }
  
}
// fallback obligatorio
return ['☁️', 'Nublado'];

// =============================================
//  MENSAJE CONTEXTUAL SEGÚN CLIMA
// =============================================
function getAlert(code, temp) {
  const frio = temp <= 5;
  const fresco = temp > 5 && temp <= 14;
  const calor = temp >= 28;
  const mucho_calor = temp >= 35;

  if (code === 0 || code === 1) {
    if (frio)       return { text: 'Cielo despejado, pero hace mucho frío. Abrígate bien.', dot: '#93c5fd' };
    if (fresco)     return { text: 'Cielo despejado. Coge una chaqueta, refresca.', dot: '#60a5fa' };
    if (mucho_calor) return { text: 'Cielo despejado y mucho calor. Protégete del sol.', dot: '#fbbf24' };
    if (calor)      return { text: 'Cielo despejado. Aplícate protector solar.', dot: '#fbbf24' };
    return { text: 'Cielo despejado. Buen día para salir.', dot: '#60a5fa' };
  }
  if (code === 2 || code === 3) {
    if (frio)   return { text: 'Nublado y frío. Abrígate.', dot: '#94a3b8' };
    if (fresco) return { text: 'Nublado y fresco. Lleva una chaqueta por si acaso.', dot: '#94a3b8' };
    return { text: 'Cielo nublado. Puede refrescar por la tarde.', dot: '#94a3b8' };
  }
  if (code >= 45 && code <= 48)
    return { text: 'Hay niebla. Conduce con precaución y luces encendidas.', dot: '#cbd5e1' };
  if (code >= 51 && code <= 67) {
    if (frio) return { text: 'Lluvia y frío. Paraguas y abrigo.', dot: '#60a5fa' };
    return { text: 'Cielo lluvioso. Lleva paraguas antes de salir.', dot: '#60a5fa' };
  }
  if (code >= 71 && code <= 77)
    return { text: 'Está nevando. Abrígate mucho y ten cuidado al salir.', dot: '#93c5fd' };
  if (code >= 80 && code <= 82) {
    if (frio) return { text: 'Chubascos y frío. Paraguas y abrigo sí o sí.', dot: '#60a5fa' };
    return { text: 'Chubascos a lo largo del día. Lleva paraguas.', dot: '#60a5fa' };
  }
  if (code >= 85 && code <= 86)
    return { text: 'Chubascos de nieve. Precaución en carretera.', dot: '#93c5fd' };
  if (code >= 95)
    return { text: 'Tormenta eléctrica. Mejor quédate en casa.', dot: '#f87171' };
  return { text: 'Consulta el pronóstico antes de salir.', dot: '#60a5fa' };
}

// =============================================
//  DIRECCIÓN DEL VIENTO
// =============================================
function windDir(deg) {
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  return dirs[Math.round(deg / 45) % 8];
}

// =============================================
//  FONDO DINÁMICO
// =============================================
function updateSky(wmoCode, isDay) {
  document.querySelectorAll('svg').forEach(el => el.remove()); // limpiar SVGs previos

  const bg     = document.getElementById('bg');
  const stars  = document.getElementById('stars');
  const sunL   = document.getElementById('sun-layer');
  const clouds = document.getElementById('clouds');
  const rain   = document.getElementById('rain');
  const snow   = document.getElementById('snow');

  stars.className  = 'stars-layer';
  sunL.className   = 'sun-layer';
  clouds.className = 'clouds-layer';
  rain.className   = 'rain-layer';
  snow.className   = 'snow-layer';

  // reset visibilidad
  stars.classList.remove('visible');
  sunL.classList.remove('visible');
  clouds.classList.remove('visible');
  rain.classList.remove('visible');
  snow.classList.remove('visible');

  // limpiar elementos dinámicos
  sunL.innerHTML = '';
  stars.innerHTML = '';
  clouds.innerHTML = '';
  rain.innerHTML = '';
  snow.innerHTML = '';

  const isRain  = (wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82);
  const isSnow  = (wmoCode >= 71 && wmoCode <= 77) || (wmoCode >= 85 && wmoCode <= 86);
  const isStorm = wmoCode >= 95;
  const isCloudy = wmoCode >= 2 && wmoCode <= 3;
  const isFog   = wmoCode >= 45 && wmoCode <= 48;

  if (!isDay) {
    bg.className = 'bg-layer night';
    buildStars();
    stars.classList.add('visible');
    if (isRain || isStorm) { buildClouds(0.06); clouds.classList.add('visible'); buildRain(); rain.classList.add('visible'); }
    if (isSnow) { buildClouds(0.06); clouds.classList.add('visible'); buildSnow(); snow.classList.add('visible'); }
    if (isCloudy || isFog) { buildClouds(0.08); clouds.classList.add('visible'); }
  } else if (isStorm) {
    bg.className = 'bg-layer stormy';
    buildClouds(0.06); clouds.classList.add('visible');
    buildRain(); rain.classList.add('visible');
  } else if (isRain) {
    bg.className = 'bg-layer rainy';
    buildClouds(0.07); clouds.classList.add('visible');
    buildRain(); rain.classList.add('visible');
  } else if (isSnow) {
    bg.className = 'bg-layer snowy';
    buildClouds(0.08); clouds.classList.add('visible');
    buildSnow(); snow.classList.add('visible');
  } else if (isCloudy || isFog) {
    bg.className = 'bg-layer cloudy';
    buildClouds(0.12); clouds.classList.add('visible');
  } else {
    bg.className = 'bg-layer sunny';
    buildSun(); sunL.classList.add('visible');
  }
}

// ===== Construir estrellas =====
function buildStars() {
  const c = document.getElementById('stars');
  if (c.children.length) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = (Math.random() * 1.5 + 0.5) + 'px';
    s.style.cssText = `width:${sz};height:${sz};top:${Math.random()*70}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*3}s;animation-delay:${-Math.random()*4}s`;
    c.appendChild(s);
  }
}

// ===== Construir sol =====
function buildSun() {
  const c = document.getElementById('sun-layer');
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 480 200');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:200px';
  const cx = 380, cy = 80, r = 48;
  // Rayos
  [[0,-1],[0.7,-0.7],[1,0],[0.7,0.7],[0,1],[-0.7,0.7],[-1,0],[-0.7,-0.7]].forEach(([dx,dy]) => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', cx+dx*(r+8)); l.setAttribute('y1', cy+dy*(r+8));
    l.setAttribute('x2', cx+dx*(r+22)); l.setAttribute('y2', cy+dy*(r+22));
    l.setAttribute('stroke', 'rgba(255,220,100,0.28)');
    l.setAttribute('stroke-width', '2.5');
    l.setAttribute('stroke-linecap', 'round');
    l.className.baseVal = 'sun-ray';
    svg.appendChild(l);
  });
  // Círculo exterior
  const co = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  co.setAttribute('cx', cx); co.setAttribute('cy', cy); co.setAttribute('r', r);
  co.setAttribute('fill', 'rgba(255,210,80,0.15)');
  co.className.baseVal = 'sun-circle';
  svg.appendChild(co);
  // Círculo interior
  const ci = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ci.setAttribute('cx', cx); ci.setAttribute('cy', cy); ci.setAttribute('r', r * 0.58);
  ci.setAttribute('fill', 'rgba(255,235,120,0.22)');
  svg.appendChild(ci);
  c.appendChild(svg);
}

// ===== Construir nubes =====
function buildClouds(opacity) {
  const c = document.getElementById('clouds');
  c.innerHTML = '';
  [
    { w: 260, h: 65, top: '8%',  dur: 32, delay: -10 },
    { w: 180, h: 50, top: '18%', dur: 44, delay: -22 },
    { w: 220, h: 58, top: '4%',  dur: 26, delay: -5  },
    { w: 150, h: 42, top: '28%', dur: 52, delay: -30 },
    { w: 190, h: 52, top: '14%', dur: 38, delay: -15 },
  ].forEach(cfg => {
    const d = document.createElement('div');
    d.className = 'cloud-shape';
    d.style.cssText = `width:${cfg.w}px;height:${cfg.h}px;top:${cfg.top};background:rgba(255,255,255,${opacity});animation-duration:${cfg.dur}s;animation-delay:${cfg.delay}s`;
    c.appendChild(d);
  });
}

// ===== Construir lluvia =====
function buildRain() {
  const c = document.getElementById('rain');
  if (c.children.length) return;
  for (let i = 0; i < 70; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.cssText = `left:${Math.random()*100}%;height:${10+Math.random()*22}px;animation-duration:${0.4+Math.random()*0.7}s;animation-delay:${-Math.random()*2}s`;
    c.appendChild(d);
  }
}

// ===== Construir nieve =====
function buildSnow() {
  const c = document.getElementById('snow');
  if (c.children.length) return;
  for (let i = 0; i < 50; i++) {
    const f = document.createElement('div');
    f.className = 'flake';
    const s = (2 + Math.random() * 4) + 'px';
    f.style.cssText = `width:${s};height:${s};left:${Math.random()*100}%;animation-duration:${3+Math.random()*4}s;animation-delay:${-Math.random()*5}s`;
    c.appendChild(f);
  }
}

// =============================================
//  UI HELPERS
// =============================================
function showLoader() {
  document.getElementById('statusArea').innerHTML =
    '<div class="status"><div class="loader"></div>Obteniendo datos...</div>';
  document.getElementById('mainCard').classList.remove('visible');
  document.getElementById('forecastCard').classList.remove('visible');
}

function showError(msg) {
  document.getElementById('statusArea').innerHTML =
    `<div class="error-msg">⚠️ ${msg}</div>`;
}

function clearStatus() {
  document.getElementById('statusArea').innerHTML = '';
}

// =============================================
//  BUSCADOR DESPLEGABLE
// =============================================
let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  document.getElementById('searchWrap').classList.toggle('open', searchOpen);
  if (searchOpen) setTimeout(() => document.getElementById('cityInput').focus(), 400);
}

function closeSearch() {
  searchOpen = false;
  document.getElementById('searchWrap').classList.remove('open');
  document.getElementById('cityInput').blur();
}

// =============================================
//  RENDER CLIMA ACTUAL (Open-Meteo)
// =============================================
function renderWeather(data, cityName, countryName) {
  const cur = data.current;

  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);
  const now = new Date(data.current.time);

  const isDay = now >= sunrise && now < sunset;

  const [ico, desc] = getWMO(cur.weather_code, isDay);
  const alert = getAlert(cur.weather_code, Math.round(cur.temperature_2m));

  updateSky(cur.weather_code, isDay);
  clearStatus();

 
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateCapitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const card = document.getElementById('mainCard');
 card.innerHTML = `
  <div class="city-row">
    <div class="city-name">${cityName}</div>
    <div class="city-meta">${countryName}</div>
    <div class="local-time">⏱ ${timeStr} · ${dateCapitalized}</div>
  </div>
  <div class="weather-icon">${ico}</div>
  <div class="temp-row">
    <div class="temp-big">${Math.round(cur.temperature_2m)}</div>
    <div class="temp-unit">°C</div>
  </div>
  <div class="feels-like">Sensación térmica ${Math.round(cur.apparent_temperature)}°C</div>
  <div class="description">${desc}</div>
  <div class="alert-box">
    <div class="alert-dot" style="background:${alert.dot}"></div>
    <span>${alert.text}</span>
  </div>
  <div class="divider"></div>
  <div class="stats">
    <div class="stat">
      <div class="stat-icon">💧</div>
      <div class="stat-val">${cur.relative_humidity_2m}%</div>
      <div class="stat-lbl">Humedad</div>
    </div>
    <div class="stat">
      <div class="stat-icon">💨</div>
      <div class="stat-val">${Math.round(cur.wind_speed_10m)} km/h</div>
      <div class="stat-lbl">Viento ${windDir(cur.wind_direction_10m)}</div>
    </div>
    <div class="stat">
      <div class="stat-icon">${isDay ? '🌅' : '🌙'}</div>
      <div class="stat-val">${isDay ? 'Día' : 'Noche'}</div>
      <div class="stat-lbl">Momento</div>
    </div>
  </div>
`;
  setTimeout(() => card.classList.add('visible'), 50);
}

// =============================================
//  RENDER PRONÓSTICO 24H (Open-Meteo hourly)
// =============================================
function renderForecast(data) {
  const now = new Date();
  const currentHour = now.getHours();

  // Encontrar el índice de la hora actual en los datos
  const times = data.hourly.time;
  let startIdx = 0;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]);
    if (t.getHours() === currentHour && t.toDateString() === now.toDateString()) {
      startIdx = i;
      break;
    }
  }

  // Tomar 24 horas desde ahora
  const items = [];
  for (let i = startIdx; i < startIdx + 24 && i < times.length; i++) {
    const t = new Date(times[i]);
    const label = i === startIdx ? 'Ahora' : t.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const [ico] = getWMO(data.hourly.weather_code[i], true);
    const temp = Math.round(data.hourly.temperature_2m[i]);
    const precip = data.hourly.precipitation_probability[i] ?? 0;
    items.push({ label, ico, temp, precip, isNow: i === startIdx });
  }

  const fc = document.getElementById('forecastCard');
  fc.innerHTML = `
    <div class="forecast-title">Próximas 24 horas</div>
    <div class="hourly-row">
      ${items.map(h => `
        <div class="hour-item${h.isNow ? ' now' : ''}">
          <div class="hour-time">${h.label}</div>
          <div class="hour-ico">${h.ico}</div>
          <div class="hour-temp">${h.temp}°</div>
          ${h.precip > 0 ? `<div class="hour-rain">${h.precip}%</div>` : ''}
        </div>`).join('')}
    </div>
  `;
  setTimeout(() => fc.classList.add('visible'), 150);
}

// =============================================
//  FETCH OPEN-METEO (clima + pronóstico horario)
// =============================================
async function fetchOpenMeteo(lat, lon, cityName, countryName) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_days=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderWeather(data, cityName, countryName);
    renderForecast(data);
  } catch {
    showError('No se pudieron cargar los datos del clima.');
  }
}

// =============================================
//  BUSCAR CIUDAD (OpenWeatherMap geocoding → Open-Meteo)
// =============================================
async function searchCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;
  closeSearch();
  showLoader();

  try {
    // OpenWeatherMap geocoding para obtener coordenadas
    const geoRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}&type=geo`);
    const geoData = await geoRes.json();

    if (geoData.cod !== 200 && !geoData.coord) {
      showError(`No se encontró "${city}". Prueba con otro nombre.`);
      return;
    }

    const lat = geoData.coord.lat;
    const lon = geoData.coord.lon;
    const cityName = geoData.name;
    const countryName = geoData.sys?.country || '';

    await fetchOpenMeteo(lat, lon, cityName, countryName);
  } catch {
    showError('Error al buscar la ciudad. Comprueba tu conexión.');
  }
}

// =============================================
//  GEOLOCALIZACIÓN AUTOMÁTICA
// =============================================
function autoLocate() {
  if (!navigator.geolocation) {
    showError('Geolocalización no disponible en tu navegador.');
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        // Nominatim para nombre de ciudad por coordenadas
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`);
        const d = await r.json();
        const city = d.address.city || d.address.town || d.address.village || d.address.county || 'Mi ubicación';
        const country = d.address.country || '';
        await fetchOpenMeteo(lat, lon, city, country);
      } catch {
        await fetchOpenMeteo(lat, lon, 'Mi ubicación', '');
      }
    },
    () => showError('Permiso de ubicación denegado. Busca tu ciudad con la lupa.')
  );
}

// =============================================
//  INICIO
// =============================================
window.addEventListener('load', autoLocate);
