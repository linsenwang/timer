const CACHE_NAME = 'running-timer-v3';

// 全是相对路径：本站点在 /timer/ 下，'./' 指的就是 /timer/
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './back.svg',
  './forward.svg'
];

// 安装时逐个缓存，某个文件 404 不会让整批缓存失败
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(STATIC_ASSETS.map(async (url) => {
      try {
        await cache.add(url);
      } catch (err) {
        console.log('缓存失败:', url, err);
      }
    }));
  })());
  self.skipWaiting();
});

// 激活时清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 页面本身与 config.js 走网络优先：改完配置刷新一次就能生效，离线时回落到缓存
  if (req.mode === 'navigate' || url.pathname.endsWith('/config.js')) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(req, { cache: 'no-cache' });
    if (res && res.status === 200 && res.type === 'basic') {
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cached = (await cache.match(req, { ignoreSearch: true }))
      || (await cache.match('./index.html'))
      || (await cache.match('./'));
    if (cached) return cached;
    return offlineResponse();
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200 && res.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    return offlineResponse();
  }
}

function offlineResponse() {
  return new Response('离线且无缓存', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
