// Service Worker for Shababna Platform
const CACHE_NAME = 'shababna-v1';
const STATIC_CACHE = 'shababna-static-v1';
const DATA_CACHE = 'shababna-data-v1';

// الملفات المهمة للتخزين المؤقت
const STATIC_FILES = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/images/logo.webp',
    '/images/hero-bg.webp',
    '/fonts/Inter-Regular.woff2',
    '/fonts/NotoSansArabic-Regular.woff2',
];

// استراتيجيات التخزين المؤقت
const CACHE_STRATEGIES = {
    // Cache First للملفات الثابتة
    STATIC: 'cache-first',
    // Network First للبيانات
    DATA: 'network-first',
    // Stale While Revalidate للصفحات
    PAGES: 'stale-while-revalidate',
};

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // إنشاء cache للملفات الثابتة
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.addAll(STATIC_FILES);
            }),
            // إنشاء cache للبيانات
            caches.open(DATA_CACHE).then((cache) => {
                return cache.addAll([]);
            }),
        ])
    );
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // تنظيف الـ caches القديمة
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME &&
                            cacheName !== STATIC_CACHE &&
                            cacheName !== DATA_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // السيطرة على جميع الصفحات
            self.clients.claim(),
        ])
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // تجاهل الطلبات غير GET
    if (request.method !== 'GET') {
        return;
    }

    // تجاهل الطلبات الخارجية
    if (url.origin !== self.location.origin) {
        return;
    }

    // تطبيق استراتيجيات التخزين المؤقت
    if (isStaticFile(request)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isDataRequest(request)) {
        event.respondWith(networkFirst(request, DATA_CACHE));
    } else if (isPageRequest(request)) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        event.respondWith(networkOnly(request));
    }
});

// فحص نوع الملف
function isStaticFile(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|otf)$/);
}

// فحص طلب البيانات
function isDataRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/');
}

// فحص طلب الصفحة
function isPageRequest(request) {
    const url = new URL(request.url);
    return url.pathname === '/' ||
        url.pathname.startsWith('/about') ||
        url.pathname.startsWith('/events') ||
        url.pathname.startsWith('/programs') ||
        url.pathname.startsWith('/blogs') ||
        url.pathname.startsWith('/contact');
}

// استراتيجية Cache First
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // إرجاع صفحة offline إذا فشل الطلب
        if (request.destination === 'document') {
            return cache.match('/offline.html');
        }
        throw error;
    }
}

// استراتيجية Network First
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // إعادة التحقق من الشبكة في الخلفية
    const networkResponsePromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });

    // إرجاع الاستجابة المخزنة مؤقتاً إذا كانت متوفرة
    if (cachedResponse) {
        return cachedResponse;
    }

    // انتظار استجابة الشبكة
    return networkResponsePromise;
}

// استراتيجية Network Only
async function networkOnly(request) {
    return fetch(request);
}

// معالجة الرسائل
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_CLEAR') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// معالجة الأخطاء
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

// معالجة الرفض
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});