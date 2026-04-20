// ThinkSwipe Service Worker v3 — Network-first for HTML, cache-first for assets
const CACHE_NAME = 'thinkswipe-v3';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: cache static assets only (not HTML — network first for HTML)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Immediately activate new SW
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: 
// - HTML/navigate requests → NETWORK FIRST (fixes mobile refresh issue)
// - API requests → NETWORK ONLY (no caching)
// - Static assets → CACHE FIRST (fast)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-http and non-https
  if (!url.protocol.startsWith('http')) return;

  // API requests — never cache, always network
  if (url.pathname.startsWith('/questions') ||
      url.pathname.startsWith('/answer') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/submit')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML / navigation requests — network first, fallback to cache
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update the cache with fresh HTML
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
