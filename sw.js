// ========================================================
// SERVICE WORKER — La Travesía de Kukulcán
// ========================================================
const CACHE_VERSION = 'v7';
const CACHE_NAME = `kukulcan-${CACHE_VERSION}`;

// Recursos que se cachean durante la instalación (precache)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './snk.png'
];

// Extensiones que se sirven con estrategia Cache-First
const CACHE_FIRST_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.mp3', '.ogg', '.wav', '.mp4', '.webm'
];

// Extensiones que se sirven con estrategia Network-First
const NETWORK_FIRST_EXTENSIONS = [
  '.html', '.htm', '.css', '.js', '.mjs', '.json', '.xml'
];

// ========================================================
// INSTALL — Precarga de assets esenciales
// ========================================================
self.addEventListener('install', event => {
  console.log('[SW] Instalando versión:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // addAll falla si UNO solo falla. Usamos un enfoque resiliente.
        return Promise.all(
          PRECACHE_ASSETS.map(url =>
            cache.add(url).catch(err => {
              console.warn(`[SW] No se pudo cachear ${url}:`, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Precache completado. Activando inmediatamente...');
        return self.skipWaiting();
      })
  );
});

// ========================================================
// ACTIVATE — Limpieza de versiones antiguas
// ========================================================
self.addEventListener('activate', event => {
  console.log('[SW] Activando versión:', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Eliminando caché obsoleto:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[SW] Tomando control de todas las pestañas...');
        return self.clients.claim();
      })
  );
});

// ========================================================
// FETCH — Estrategias según tipo de recurso
// ========================================================
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo manejamos GET. POST, PUT, DELETE van directos a la red.
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // Ignoramos peticiones a otros orígenes (APIs, CDNs, analytics, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Ignoramos peticiones de extensiones del navegador u otros esquemas
  if (!url.protocol.startsWith('http')) {
    return;
  }

  const pathname = url.pathname.toLowerCase();
  const ext = pathname.substring(pathname.lastIndexOf('.'));

  // -------- Cache-First (imágenes, fuentes, media) --------
  if (CACHE_FIRST_EXTENSIONS.includes(ext)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // -------- Network-First (HTML, CSS, JS, JSON) --------
  if (NETWORK_FIRST_EXTENSIONS.includes(ext) || pathname === '/' || pathname.endsWith('/')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // -------- Por defecto: Network-First (para todo lo demás) --------
  event.respondWith(networkFirst(req));
});

// ========================================================
// ESTRATEGIAS
// ========================================================

/**
 * Network-First: intenta la red, si falla usa el caché.
 * Ideal para HTML, CSS y JS (siempre queremos la última versión).
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    // Solo cacheamos respuestas válidas de nuestro origen
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Red falló, usando caché para:', request.url);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Si no hay caché y la petición es de navegación, devolvemos el index
    if (request.mode === 'navigate') {
      const fallback = await cache.match('./index.html');
      if (fallback) return fallback;
    }
    // Sin caché ni fallback: error
    return new Response('Recurso no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }
}

/**
 * Cache-First: intenta el caché, si no está, va a la red y lo guarda.
 * Ideal para imágenes, fuentes y media (no cambian).
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Recurso no disponible offline:', request.url);
    return new Response('Recurso no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }
}

// ========================================================
// MENSAJES DESDE LA PÁGINA (para forzar actualización, etc.)
// ========================================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => {
      event.ports[0]?.postMessage({ success: true });
    });
  }
});