const VERSION = 'v1';
const CORE = ['/', '/about/', '/favicon.svg', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const net = fetch(e.request).then((res) => {
          if (res && res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  } else {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.ok && res.type !== 'opaque') {
          caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
