self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    )
})
/*
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (names) {
            for (let name of names)
                caches.delete(name);
            console.log('Cache was deleted' + name)
        })
        // caches.keys().then(function (keyList) {
        //     return Promise.all(keyList.map(function (key) {
        //         if (cacheName.indexOf(key) === -1) {
        //             return caches.delete(weatherlyPWA);
        //         }
        //     }));
        // })
    );
});
*/
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return true
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

var cacheName = 'weatherlyPWA?v21';
var contentToCache = [
    '/index.html?v21',
    '/css/style.css',
    '/scripts/app.js',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png'
]

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
