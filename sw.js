// Sube este número cada vez que cambies algo: a todos les saldrá «Nueva versión lista».
const VERSION = "auseva-v8";
const FILES = ["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png","favicon-32.png"];


self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Red primero (para ver siempre la última quedada) y, sin conexión, lo guardado.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
