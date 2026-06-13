const CACHE = "dk-booking-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Cache-first for Next.js static bundles and generated icons
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(e.request).then(
          (hit) =>
            hit ??
            fetch(e.request).then((res) => {
              cache.put(e.request, res.clone());
              return res;
            }),
        ),
      ),
    );
  }
  // All other requests (pages, API, actions): network only — no stale auth state
});
