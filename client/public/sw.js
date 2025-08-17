// Service Worker for Shababna Platform
const CACHE_NAME = 'shababna-v1';
const STATIC_CACHE = 'shababna-static-v1';
const DYNAMIC_CACHE = 'shababna-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
];

// API endpoints to cache
const API_CACHE = [
    '/api/events',
    '/api/programs',
    '/api/blogs',
    '/api/contact',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(handleApiRequest(request));
        return;
    }

    // Handle static assets
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(handleStaticAsset(request));
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }

    // Default: network first, fallback to cache
    event.respondWith(
        fetch(request)
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Handle API requests with cache strategy
async function handleApiRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);

        // Clone response for caching
        const responseClone = networkResponse.clone();

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, responseClone);
        }

        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline response
        return new Response(
            JSON.stringify({
                error: 'No internet connection',
                message: 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى'
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle static assets with cache first strategy
async function handleStaticAsset(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Update cache in background
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    caches.open(STATIC_CACHE)
                        .then((cache) => cache.put(request, response));
                }
            })
            .catch(() => {
                // Ignore fetch errors for background updates
            });

        return cachedResponse;
    }

    // Try network
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

// Handle navigation requests
async function handleNavigation(request) {
    try {
        // Try network first
        const response = await fetch(request);
        return response;
    } catch (error) {
        // Fallback to cached index.html for SPA
        const cachedResponse = await caches.match('/index.html');
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page
        return new Response(
            `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>شبابنا العالمية - غير متصل</title>
          <style>
            body {
              font-family: 'Tajawal', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              color: white;
              text-align: center;
            }
            .offline-container {
              background: rgba(255, 255, 255, 0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
              max-width: 500px;
            }
            h1 { margin-bottom: 20px; }
            p { margin-bottom: 30px; opacity: 0.9; }
            button {
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            }
            button:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <h1>🔌 غير متصل بالإنترنت</h1>
            <p>عذراً، لا يمكن الوصول إلى الموقع حالياً. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.</p>
            <button onclick="window.location.reload()">إعادة المحاولة</button>
          </div>
        </body>
      </html>
      `,
            {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Handle background sync
async function doBackgroundSync() {
    try {
        // Sync any pending requests
        const requests = await getPendingRequests();

        for (const request of requests) {
            try {
                await fetch(request);
                await removePendingRequest(request);
            } catch (error) {
                console.error('Background sync failed:', error);
            }
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}

// Store pending requests for background sync
async function storePendingRequest(request) {
    const db = await openDB();
    const tx = db.transaction('pending-requests', 'readwrite');
    const store = tx.objectStore('pending-requests');
    await store.add(request);
}

// Get pending requests
async function getPendingRequests() {
    const db = await openDB();
    const tx = db.transaction('pending-requests', 'readonly');
    const store = tx.objectStore('pending-requests');
    return await store.getAll();
}

// Remove pending request
async function removePendingRequest(request) {
    const db = await openDB();
    const tx = db.transaction('pending-requests', 'readwrite');
    const store = tx.objectStore('pending-requests');
    await store.delete(request);
}

// Open IndexedDB
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('shababna-sw', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('pending-requests')) {
                db.createObjectStore('pending-requests', { keyPath: 'url' });
            }
        };
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'رسالة جديدة من شبابنا العالمية',
        icon: '/favicon-192x192.png',
        badge: '/favicon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'عرض',
                icon: '/favicon-192x192.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/favicon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('شبابنا العالمية', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker loaded successfully');