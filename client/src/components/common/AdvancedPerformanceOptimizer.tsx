import React, { useEffect, useCallback, useRef, memo } from 'react';

interface AdvancedPerformanceOptimizerProps {
  children: React.ReactNode;
}

const AdvancedPerformanceOptimizer: React.FC<AdvancedPerformanceOptimizerProps> =
  memo(({ children }) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // تحسين التمرير - Throttling مع requestAnimationFrame
    const handleScroll = useCallback(() => {
      if (scrollTimeoutRef.current) {
        return;
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          // تحسين الأداء عند التمرير
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

          // تحسين الصور المرئية فقط
          const images = document.querySelectorAll('img[data-lazy]');
          images.forEach((img) => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
              const lazyImg = img as HTMLImageElement;
              if (lazyImg.dataset.src) {
                lazyImg.src = lazyImg.dataset.src;
                lazyImg.removeAttribute('data-lazy');
                lazyImg.removeAttribute('data-src');
              }
            }
          });

          // تحسين المكونات المرئية
          const components = document.querySelectorAll('[data-optimize]');
          components.forEach((component) => {
            const rect = component.getBoundingClientRect();
            if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
              component.classList.add('optimized');
            }
          });

          scrollTimeoutRef.current = null;
        });
      }, 16); // ~60fps
    }, []);

    // تحسين تغيير الحجم - Debouncing
    const handleResize = useCallback(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        // تحسين الأداء عند تغيير الحجم
        const width = window.innerWidth;
        const height = window.innerHeight;

        // تحديث CSS variables للتحسين
        document.documentElement.style.setProperty(
          '--vh',
          `${height * 0.01}px`
        );
        document.documentElement.style.setProperty('--vw', `${width * 0.01}px`);

        // تحسين الصور حسب الحجم
        const images = document.querySelectorAll('img[data-responsive]');
        images.forEach((img) => {
          const responsiveImg = img as HTMLImageElement;
          const sizes = responsiveImg.dataset.sizes;
          if (sizes) {
            responsiveImg.sizes = sizes;
          }
        });
      });
    }, []);

    // تحسين تحميل الصور - Intersection Observer
    const setupImageOptimization = useCallback(() => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;

              // تحسين تحميل الصور
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.removeAttribute('data-src');
              }

              // تحسين WebP support
              if (img.dataset.webp && window.Modernizr?.webp) {
                img.src = img.dataset.webp;
              }

              observerRef.current?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );

      // مراقبة الصور الكسولة
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => observerRef.current?.observe(img));
    }, []);

    // تحسين تحميل المكونات - Resize Observer
    const setupComponentOptimization = useCallback(() => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      resizeObserverRef.current = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;

          // تحسين المكونات حسب الحجم
          if (entry.contentRect.width < 768) {
            element.classList.add('mobile-optimized');
          } else {
            element.classList.remove('mobile-optimized');
          }
        });
      });

      // مراقبة المكونات القابلة للتحسين
      const optimizableComponents =
        document.querySelectorAll('[data-optimize]');
      optimizableComponents.forEach((component) => {
        resizeObserverRef.current?.observe(component);
      });
    }, []);

    // تحسين الذاكرة - Memory Management
    const setupMemoryOptimization = useCallback(() => {
      // تنظيف الذاكرة عند عدم النشاط
      let memoryCleanupTimeout: NodeJS.Timeout;

      const cleanupMemory = () => {
        // تنظيف المكونات غير المرئية
        const hiddenComponents = document.querySelectorAll('[data-hidden]');
        hiddenComponents.forEach((component) => {
          const element = component as HTMLElement;
          if (element.dataset.cleanup === 'true') {
            element.innerHTML = '';
            element.style.display = 'none';
          }
        });

        // تنظيف الصور المخزنة مؤقتاً
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              if (cacheName.includes('image-cache')) {
                caches.delete(cacheName);
              }
            });
          });
        }
      };

      const resetMemoryTimeout = () => {
        clearTimeout(memoryCleanupTimeout);
        memoryCleanupTimeout = setTimeout(cleanupMemory, 30000); // 30 ثانية
      };

      // إعادة تعيين المؤقت عند النشاط
      document.addEventListener('mousemove', resetMemoryTimeout);
      document.addEventListener('keydown', resetMemoryTimeout);
      document.addEventListener('scroll', resetMemoryTimeout);

      return () => {
        clearTimeout(memoryCleanupTimeout);
        document.removeEventListener('mousemove', resetMemoryTimeout);
        document.removeEventListener('keydown', resetMemoryTimeout);
        document.removeEventListener('scroll', resetMemoryTimeout);
      };
    }, []);

    // تحسين الشبكة - Network Optimization
    const setupNetworkOptimization = useCallback(() => {
      // تحسين طلبات API
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service Worker غير متاح
        });
      }

      // تحسين التخزين المؤقت
      if ('caches' in window) {
        // تخزين مؤقت للصور
        const imageCache = 'image-cache-v1';
        caches.open(imageCache).then((cache) => {
          // إضافة الصور المهمة للتخزين المؤقت
          const importantImages = [
            '/images/hero-bg.jpg',
            '/images/logo.png',
            '/images/fallback.svg',
          ];
          cache.addAll(importantImages);
        });
      }
    }, []);

    // تحسين الأداء - Performance Monitoring
    const setupPerformanceMonitoring = useCallback(() => {
      // مراقبة أداء التحميل
      if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;

              // تسجيل أداء التحميل
              console.log('Page Load Performance:', {
                domContentLoaded:
                  navEntry.domContentLoadedEventEnd -
                  navEntry.domContentLoadedEventStart,
                loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
                firstContentfulPaint:
                  performance.getEntriesByType('paint')[1]?.startTime,
              });
            }
          });
        });

        observer.observe({ entryTypes: ['navigation', 'paint'] });
      }
    }, []);

    useEffect(() => {
      // إعداد جميع التحسينات
      setupImageOptimization();
      setupComponentOptimization();
      setupNetworkOptimization();
      setupPerformanceMonitoring();
      const cleanupMemory = setupMemoryOptimization();

      // إضافة event listeners
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });

      // تحسين CSS للتمرير
      document.documentElement.style.setProperty('scroll-behavior', 'smooth');

      return () => {
        // تنظيف
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        cleanupMemory();
      };
    }, [
      handleScroll,
      handleResize,
      setupImageOptimization,
      setupComponentOptimization,
      setupNetworkOptimization,
      setupPerformanceMonitoring,
      setupMemoryOptimization,
    ]);

    return <>{children}</>;
  });

AdvancedPerformanceOptimizer.displayName = 'AdvancedPerformanceOptimizer';

export default AdvancedPerformanceOptimizer;
