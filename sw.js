// ========================================================
// SERVICE WORKER — La Travesía de Kukulcán
// ========================================================
const CACHE_NAME = 'kukulcan-v5'; // Incrementar versión para forzar actualización
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './snk.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(err => {
        console.warn('Algunos assets no se pudieron cachear:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Estrategia Network-First para los archivos principales
  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('style.css') || url.pathname.endsWith('script.js')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return response;
        })
        .catch(() => caches.match(req))
    );
  } else {
    // Estrategia Cache-First para otros assets (imágenes, etc.)
    event.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return response;
        });
      })
    );
  }
});