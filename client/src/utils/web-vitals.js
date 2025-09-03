// مراقبة Core Web Vitals
// https://web.dev/vitals/

// دالة لقياس Largest Contentful Paint (LCP)
export const measureLCP = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];

            // LCP يجب أن يكون أقل من 2.5 ثانية
            if (lastEntry.startTime < 2500) {
                console.log('✅ LCP ممتاز:', lastEntry.startTime, 'ms');
            } else if (lastEntry.startTime < 4000) {
                console.log('⚠️ LCP جيد:', lastEntry.startTime, 'ms');
            } else {
                console.log('❌ LCP ضعيف:', lastEntry.startTime, 'ms');
            }

            // إرسال البيانات إلى Google Analytics أو أي خدمة أخرى
            sendToAnalytics('LCP', lastEntry.startTime);
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
};

// دالة لقياس First Input Delay (FID)
export const measureFID = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();

            entries.forEach((entry) => {
                // FID يجب أن يكون أقل من 100 مللي ثانية
                if (entry.processingStart - entry.startTime < 100) {
                    console.log('✅ FID ممتاز:', entry.processingStart - entry.startTime, 'ms');
                } else if (entry.processingStart - entry.startTime < 300) {
                    console.log('⚠️ FID جيد:', entry.processingStart - entry.startTime, 'ms');
                } else {
                    console.log('❌ FID ضعيف:', entry.processingStart - entry.startTime, 'ms');
                }

                sendToAnalytics('FID', entry.processingStart - entry.startTime);
            });
        });

        observer.observe({ entryTypes: ['first-input'] });
    }
};

// دالة لقياس Cumulative Layout Shift (CLS)
export const measureCLS = () => {
    if ('PerformanceObserver' in window) {
        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }

            // CLS يجب أن يكون أقل من 0.1
            if (clsValue < 0.1) {
                console.log('✅ CLS ممتاز:', clsValue.toFixed(3));
            } else if (clsValue < 0.25) {
                console.log('⚠️ CLS جيد:', clsValue.toFixed(3));
            } else {
                console.log('❌ CLS ضعيف:', clsValue.toFixed(3));
            }

            sendToAnalytics('CLS', clsValue);
        });

        observer.observe({ entryTypes: ['layout-shift'] });
    }
};

// دالة لقياس First Contentful Paint (FCP)
export const measureFCP = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const firstEntry = entries[0];

            // FCP يجب أن يكون أقل من 1.8 ثانية
            if (firstEntry.startTime < 1800) {
                console.log('✅ FCP ممتاز:', firstEntry.startTime, 'ms');
            } else if (firstEntry.startTime < 3000) {
                console.log('⚠️ FCP جيد:', firstEntry.startTime, 'ms');
            } else {
                console.log('❌ FCP ضعيف:', firstEntry.startTime, 'ms');
            }

            sendToAnalytics('FCP', firstEntry.startTime);
        });

        observer.observe({ entryTypes: ['first-contentful-paint'] });
    }
};

// دالة لقياس Time to First Byte (TTFB)
export const measureTTFB = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const navigationEntry = entries[entries.length - 1];

            if (navigationEntry) {
                const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

                // TTFB يجب أن يكون أقل من 800 مللي ثانية
                if (ttfb < 800) {
                    console.log('✅ TTFB ممتاز:', ttfb, 'ms');
                } else if (ttfb < 1800) {
                    console.log('⚠️ TTFB جيد:', ttfb, 'ms');
                } else {
                    console.log('❌ TTFB ضعيف:', ttfb, 'ms');
                }

                sendToAnalytics('TTFB', ttfb);
            }
        });

        observer.observe({ entryTypes: ['navigation'] });
    }
};

// دالة لقياس أداء الصفحة العامة
export const measurePagePerformance = () => {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        if (navigation) {
            const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

            console.log('📊 أداء الصفحة:');
            console.log('  - وقت التحميل الكامل:', pageLoadTime, 'ms');
            console.log('  - وقت تحميل DOM:', domContentLoaded, 'ms');

            sendToAnalytics('PageLoadTime', pageLoadTime);
            sendToAnalytics('DOMContentLoaded', domContentLoaded);
        }

        if (paint.length > 0) {
            const firstPaint = paint.find(p => p.name === 'first-paint');
            const firstContentfulPaint = paint.find(p => p.name === 'first-contentful-paint');

            if (firstPaint) {
                console.log('  - First Paint:', firstPaint.startTime, 'ms');
                sendToAnalytics('FirstPaint', firstPaint.startTime);
            }

            if (firstContentfulPaint) {
                console.log('  - First Contentful Paint:', firstContentfulPaint.startTime, 'ms');
                sendToAnalytics('FirstContentfulPaint', firstContentfulPaint.startTime);
            }
        }
    }
};

// دالة لقياس أداء الصور
export const measureImagePerformance = () => {
    const images = document.querySelectorAll('img');
    let totalImageLoadTime = 0;
    let loadedImages = 0;

    images.forEach((img) => {
        if (img.complete) {
            // الصورة محملة بالفعل
            loadedImages++;
        } else {
            // انتظار تحميل الصورة
            img.addEventListener('load', () => {
                const loadTime = performance.now();
                totalImageLoadTime += loadTime;
                loadedImages++;

                if (loadedImages === images.length) {
                    const averageLoadTime = totalImageLoadTime / loadedImages;
                    console.log('🖼️ متوسط وقت تحميل الصور:', averageLoadTime.toFixed(2), 'ms');
                    sendToAnalytics('AverageImageLoadTime', averageLoadTime);
                }
            });

            img.addEventListener('error', () => {
                console.warn('❌ فشل في تحميل الصورة:', img.src);
                sendToAnalytics('ImageLoadError', 1);
            });
        }
    });

    if (loadedImages === images.length) {
        const averageLoadTime = totalImageLoadTime / loadedImages;
        console.log('🖼️ متوسط وقت تحميل الصور:', averageLoadTime.toFixed(2), 'ms');
        sendToAnalytics('AverageImageLoadTime', averageLoadTime);
    }
};

// دالة لقياس أداء الخطوط
export const measureFontPerformance = () => {
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            const fontLoadTime = performance.now();
            console.log('🔤 وقت تحميل الخطوط:', fontLoadTime.toFixed(2), 'ms');
            sendToAnalytics('FontLoadTime', fontLoadTime);
        });

        document.fonts.addEventListener('loading', () => {
            console.log('🔤 بدء تحميل الخطوط...');
        });

        document.fonts.addEventListener('loadingdone', () => {
            console.log('✅ اكتمل تحميل الخطوط');
        });
    }
};

// دالة لقياس أداء الشبكة
export const measureNetworkPerformance = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection;

        console.log('🌐 معلومات الشبكة:');
        console.log('  - نوع الاتصال:', connection.effectiveType);
        console.log('  - سرعة التحميل:', connection.downlink, 'Mbps');
        console.log('  - زمن الاستجابة:', connection.rtt, 'ms');

        sendToAnalytics('ConnectionType', connection.effectiveType);
        sendToAnalytics('DownloadSpeed', connection.downlink);
        sendToAnalytics('RTT', connection.rtt);
    }
};

// دالة لإرسال البيانات إلى Google Analytics أو أي خدمة أخرى
const sendToAnalytics = (metric, value) => {
    // يمكن إرسال البيانات إلى Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric,
            value: Math.round(value),
        });
    }

    // أو إرسالها إلى أي خدمة أخرى
    if (typeof window !== 'undefined' && window.performanceObserver) {
        window.performanceObserver.recordMetric(metric, value);
    }

    // أو حفظها في localStorage للتحليل لاحقاً
    try {
        const metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
        metrics[metric] = {
            value: value,
            timestamp: Date.now(),
        };
        localStorage.setItem('web-vitals', JSON.stringify(metrics));
    } catch (error) {
        console.warn('فشل في حفظ Web Vitals:', error);
    }
};

// دالة لبدء مراقبة جميع المقاييس
export const startPerformanceMonitoring = () => {
    console.log('🚀 بدء مراقبة أداء الموقع...');

    // مراقبة Core Web Vitals
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();

    // مراقبة أداء الصفحة
    measurePagePerformance();

    // مراقبة أداء الصور
    measureImagePerformance();

    // مراقبة أداء الخطوط
    measureFontPerformance();

    // مراقبة أداء الشبكة
    measureNetworkPerformance();

    console.log('✅ تم بدء مراقبة الأداء بنجاح');
};

// دالة لإيقاف مراقبة الأداء
export const stopPerformanceMonitoring = () => {
    console.log('🛑 إيقاف مراقبة الأداء');

    // يمكن إضافة منطق لإيقاف المراقبة هنا
    if (window.performanceObserver) {
        window.performanceObserver.disconnect();
    }
};

// تصدير جميع الدوال
export default {
    measureLCP,
    measureFID,
    measureCLS,
    measureFCP,
    measureTTFB,
    measurePagePerformance,
    measureImagePerformance,
    measureFontPerformance,
    measureNetworkPerformance,
    startPerformanceMonitoring,
    stopPerformanceMonitoring,
};
