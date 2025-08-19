// Service Worker for Shababna Platform
const CACHE_NAME = 'shababna-v1.0.0';
const STATIC_CACHE = 'shababna-static-v1.0.0';
const DYNAMIC_CACHE = 'shababna-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/images/logo.png',
    '/images/fallback.svg',
    '/images/hero-bg.jpg',
    '/images/team/president.jpg',
    '/images/events/default.jpg',
    '/images/programs/default.jpg',
    '/images/blogs/default.jpg',
];

// External domains to allow
const ALLOWED_DOMAINS = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'api.mapbox.com',
    'tiles.mapbox.com',
    'shababna-platform.onrender.com',
    'localhost:5000',
    '127.0.0.1:5000'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch((error) => {
                console.error('Error caching static files:', error);
                // Continue installation even if caching fails
                return Promise.resolve();
            })
    );

    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

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
                console.log('Service Worker activated successfully');
                // Claim all clients
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('Error during activation:', error);
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests
    if (request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Handle external resources (fonts, CDN, etc.)
    if (isExternalResource(url)) {
        event.respondWith(handleExternalResource(request));
        return;
    }

    // Handle navigation requests (HTML pages)
    if (request.destination === 'document') {
        event.respondWith(handleNavigation(request));
        return;
    }

    // Handle static assets
    event.respondWith(handleStaticAsset(request));
});

// Check if URL is external resource
function isExternalResource(url) {
    return ALLOWED_DOMAINS.some(domain => url.hostname.includes(domain));
}

// Handle external resources
async function handleExternalResource(request) {
    try {
        // Try network first for external resources
        const response = await fetch(request);

        if (response.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.warn('Failed to fetch external resource:', request.url, error);

        // Return a fallback response for fonts
        if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
            return new Response('', {
                status: 200,
                headers: {
                    'Content-Type': 'text/css',
                    'Cache-Control': 'public, max-age=86400'
                }
            });
        }

        // For other external resources, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return empty response as last resort
        return new Response('', { status: 404 });
    }
}

// Handle static assets
async function handleStaticAsset(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            // Update cache in background
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        caches.open(STATIC_CACHE)
                            .then((cache) => cache.put(request, response))
                            .catch((error) => {
                                console.warn('Failed to update cache:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.warn('Background fetch failed:', error);
                });

            return cachedResponse;
        }

        // Try network
        const response = await fetch(request);

        if (response.ok) {
            // Cache successful responses
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.warn('Failed to fetch static asset:', request.url, error);

        // Return appropriate fallback based on content type
        const url = new URL(request.url);

        if (url.pathname.endsWith('.css')) {
            return new Response('/* Fallback CSS */', {
                status: 200,
                headers: { 'Content-Type': 'text/css' }
            });
        }

        if (url.pathname.endsWith('.js')) {
            return new Response('// Fallback JS', {
                status: 200,
                headers: { 'Content-Type': 'application/javascript' }
            });
        }

        if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
            // Return fallback image
            const fallbackResponse = await caches.match('/images/fallback.svg');
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }

        return new Response('', { status: 404 });
    }
}

// Handle navigation requests
async function handleNavigation(request) {
    try {
        // Try network first for navigation
        const response = await fetch(request);
        return response;
    } catch (error) {
        console.warn('Navigation fetch failed, falling back to cached index.html:', error);

        // Fallback to cached index.html for SPA
        const cachedResponse = await caches.match('/index.html');
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page with brand identity
        return new Response(
            `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>شبابنا العالمية - غير متصل</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Tajawal', 'Inter', sans-serif;
              background: linear-gradient(135deg, #27548A 0%, #1e3a5f 50%, #0f1f2e 100%);
              margin: 0;
              padding: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              color: white;
              text-align: center;
              direction: rtl;
            }

            .offline-container {
              background: rgba(255, 255, 255, 0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              max-width: 500px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: linear-gradient(135deg, #4CAF50, #45a049);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
              box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
            }

            h1 {
              margin-bottom: 20px;
              font-size: 24px;
              font-weight: 700;
              background: linear-gradient(135deg, #4CAF50, #45a049);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            p {
              margin-bottom: 30px;
              opacity: 0.9;
              line-height: 1.6;
              font-size: 14px;
            }

            .status-icon {
              font-size: 40px;
              margin-bottom: 20px;
              display: block;
            }

            button {
              background: linear-gradient(135deg, #4CAF50, #45a049);
              border: none;
              color: white;
              padding: 12px 24px;
              border-radius: 12px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3);
            }

            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 24px rgba(76, 175, 80, 0.4);
            }

            button:active {
              transform: translateY(0);
            }

            .brand-name {
              font-size: 20px;
              font-weight: 800;
              margin-bottom: 10px;
              background: linear-gradient(135deg, #4CAF50, #45a049);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .subtitle {
              font-size: 12px;
              opacity: 0.7;
              margin-bottom: 30px;
            }

            @media (max-width: 480px) {
              .offline-container {
                padding: 30px 20px;
                margin: 20px;
              }

              h1 {
                font-size: 20px;
              }

              .brand-name {
                font-size: 18px;
              }
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="logo">ش</div>
            <div class="brand-name">شبابنا العالمية</div>
            <div class="subtitle">منصة الشباب المسلم العالمية</div>

            <span class="status-icon">🔌</span>
            <h1>غير متصل بالإنترنت</h1>
            <p>عذراً، لا يمكن الوصول إلى الموقع حالياً. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.</p>
            <button onclick="window.location.reload()">إعادة المحاولة</button>
          </div>
        </body>
      </html>
      `,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache'
                }
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

async function doBackgroundSync() {
    try {
        // Handle any pending background tasks
        console.log('Performing background sync...');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();

        const options = {
            body: data.body || 'رسالة جديدة من منصة شبابنا',
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'شبابنا العالمية', options)
        );
    }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('Service Worker loaded successfully');