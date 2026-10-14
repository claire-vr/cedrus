/*
 * Cedrus service worker: makes the app work offline.
 *
 * This is a template. At build time the `cedrusServiceWorker` plugin in
 * vite.config.ts fills in the list of files to save and a version number,
 * and writes the result to dist/service-worker.js. Every deploy therefore
 * has a new version: the phone downloads it in the background, and the next
 * time the app is opened it runs the new version.
 */

const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const CACHE = `cedrus-${VERSION}`;

// Save the whole app (page, scripts, styles, icons) when installed.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Remove older versions and take over open pages.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('cedrus-') && key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page loads (any route, e.g. /topics/food): try the network first so a
  // new version shows up as soon as it is online; fall back to the saved
  // app when offline or when the connection is too slow.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Scripts, styles, icons: their names change with every build, so the
  // saved copy is always right. Use it, and save anything new we see.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await withTimeout(fetch(request), 4000);
    if (response.ok) cache.put('/', response.clone());
    return response;
  } catch {
    // The app is a single page: every route is served by index.html.
    return (await cache.match('/')) || Response.error();
  }
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
