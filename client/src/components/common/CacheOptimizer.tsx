import React, { useEffect, useRef } from 'react';

interface CacheOptimizerProps {
  children: React.ReactNode;
}

const CacheOptimizer: React.FC<CacheOptimizerProps> = ({ children }) => {
  const isRegistered = useRef(false);

  useEffect(() => {
    // تسجيل Service Worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && !isRegistered.current) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
          isRegistered.current = true;
        } catch (error) {
          console.warn('Service Worker registration failed:', error);
        }
      }
    };

    // تحسين التخزين المؤقت للصور
    const optimizeImageCache = () => {
      const images = document.querySelectorAll('img[src]');
      images.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('/')) {
          // إضافة loading="lazy" للصور غير المهمة
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }

          // إضافة decoding="async" لتحسين الأداء
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }
        }
      });
    };

    // تحسين التخزين المؤقت للروابط
    const optimizeLinkCache = () => {
      const links = document.querySelectorAll('a[href]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('#')) {
          // إضافة prefetch للروابط الداخلية
          link.setAttribute('data-prefetch', 'true');

          // تحسين التحميل المسبق
          if (link.getBoundingClientRect().top < window.innerHeight) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = href;
            document.head.appendChild(prefetchLink);
          }
        }
      });
    };

    // تحسين التخزين المؤقت للملفات الثابتة
    const optimizeStaticCache = () => {
      // التحقق من وجود الصور قبل إضافة preload
      const checkAndPreloadImage = (src: string) => {
        const img = new Image();
        img.onload = () => {
          // إضافة preload فقط إذا كانت الصورة موجودة ومستخدمة
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = src;
          link.as = 'image';
          document.head.appendChild(link);
        };
        img.onerror = () => {
          console.warn(`Image not found: ${src}`);
        };
        img.src = src;
      };

      // التحقق من الصور المهمة فقط
      const importantImages = [
        '/images/logo.svg', // استخدام SVG بدلاً من webp
        '/images/logo.png', // fallback
      ];

      importantImages.forEach(checkAndPreloadImage);

      // إضافة preload للخطوط فقط
      const fontFiles = [
        '/fonts/Inter-Regular.woff2',
        '/fonts/NotoSansArabic-Regular.woff2',
      ];

      fontFiles.forEach((file) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = file;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // تحسين التخزين المؤقت للبيانات
    const optimizeDataCache = () => {
      if ('caches' in window) {
        // إنشاء cache للبيانات
        const dataCache = 'shababna-data-v1';
        caches.open(dataCache).then((cache) => {
          // إضافة البيانات المهمة للتخزين المؤقت
          const dataUrls = ['/api/events', '/api/programs', '/api/blogs'];

          cache.addAll(dataUrls).catch((error) => {
            console.warn('Failed to cache data:', error);
          });
        });
      }
    };

    // تطبيق التحسينات
    registerServiceWorker();
    optimizeImageCache();
    optimizeLinkCache();
    optimizeStaticCache();
    optimizeDataCache();

    // تحسين التخزين المؤقت عند التمرير
    const handleScroll = () => {
      requestAnimationFrame(() => {
        optimizeLinkCache();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <>{children}</>;
};

export default CacheOptimizer;
