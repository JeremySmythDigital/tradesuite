// Cypress Signal Tech PWA Service Worker
const CACHE_NAME = 'cypress-tech-v1';
const OFFLINE_URL = '/tech';

const STATIC_ASSETS = [
  '/tech',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
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

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests (they need to be online)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Return cached version or offline page
        return caches.match(event.request).then((response) => {
          return response || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-jobs') {
    event.waitUntil(syncJobs());
  }
  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos());
  }
});

async function syncJobs() {
  // Get pending job updates from IndexedDB
  // Sync with server when online
  console.log('Syncing offline job updates...');
}

async function syncPhotos() {
  // Get pending photos from IndexedDB
  // Upload to server when online
  console.log('Syncing offline photos...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New job update',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/tech',
    },
    actions: [
      { action: 'view', title: 'View Job' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Cypress Signal', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
