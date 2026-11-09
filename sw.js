// Guarda o app no celular para abrir sem internet.
const CACHE = 'caderno-v4';
const ARQUIVOS = ['./', 'index.html', 'manifest.json', 'icone.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;            // envio para a planilha passa direto
  if (new URL(req.url).hostname.endsWith('script.google.com')) return;
  e.respondWith(
    fetch(req).then(res => {                     // com internet: pega a versão nova e guarda
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
