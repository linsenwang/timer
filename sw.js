const CACHE_NAME = 'running-timer-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/back.svg',
  '/forward.svg'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.log('Cache install failed:', err);
    })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先从缓存读取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 如果缓存中有，返回缓存
      if (cached) {
        return cached;
      }
      // 否则发起网络请求
      return fetch(event.request).then((response) => {
        // 只缓存成功的 GET 请求
        if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
          return response;
        }
        // 克隆响应（因为 response 只能使用一次）
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => {
      // 离线且缓存中没有时，返回离线页面或失败
      return new Response('Offline');
    })
  );
});
