const CACHE_NAME = 'transformer-pwa-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './transformer.js',
    './manifest.json',
    './icon.svg'
];

// Install Event
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Event (Offline Support)
self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then((cachedResponse) => {
            return cachedResponse || fetch(evt.request);
        })
    );
});
