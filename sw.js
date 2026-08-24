// Zirbo service worker.
//
// Deliberately conservative: this site changes often (product photos,
// copy, prices), so nothing here is allowed to get permanently stuck.
// Bump CACHE_VERSION whenever you bump the ?v= cache-busting suffix on
// style.css / site.js, so old shells get cleared and visitors pick up
// the new deploy instead of a cached one.
const CACHE_VERSION = "zirbo-20260824j";
const SHELL = ["/index.html", "/assets/style.css", "/assets/site.js", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL)).catch(function () {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intern the API or anything cross-origin (fonts CDN, Stripe, etc.) —
  // and never touch non-GET requests. Straight to the network, always.
  if (req.method !== "GET" || url.pathname.startsWith("/api/")) return;
  if (url.origin !== self.location.origin) return;

  // Page navigations: always try the network first so content is never
  // stale; only fall back to a cached copy (or the cached homepage) when
  // genuinely offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match("/index.html")))
    );
    return;
  }

  // Versioned assets (style.css?v=..., site.js?v=...) are immutable under
  // that exact URL — a new deploy ships a new ?v=, never reusing the old
  // one — so cache-first here is safe and fast.
  if (url.search.indexOf("v=") !== -1) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
            return res;
          })
      )
    );
    return;
  }

  // Everything else (product photos, fonts, unversioned assets): network
  // first, so a photo Pedro just replaced is never stuck showing the old
  // one — cache is only a fallback for offline/flaky connections.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
