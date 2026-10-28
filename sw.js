// Service Worker — 版本 1.0.4（由 build_standalone.py 產生，請勿手改）
// 網頁、版本檔一律先連網路抓最新；圖片和音樂放進這個版本專屬的快取，下次更新版本號就會整批換新。
const CACHE = 'little-wizard-1.0.4';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || /\/(index\.html|version\.json|manifest[^/]*\.webmanifest|sw\.js)?$/.test(url.pathname);
  if (fresh) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(ch => ch.match(req).then(hit => hit || fetch(req, { cache: 'reload' }).then(res => {
    if (res.ok) ch.put(req, res.clone());
    return res;
  }))));
});
