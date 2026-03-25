const CACHE_NAME = 'weather-app-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json', '/icon-192x192.png', '/icon-512x512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/') ||
      e.request.url.includes('open-meteo') ||
      e.request.url.includes('openweathermap') ||
      e.request.url.includes('nominatim')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Weather App', {
      body: data.body || 'Tienes una alerta del tiempo.',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
    })
  );
});
