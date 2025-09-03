import React, { useEffect, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
}) => {
  const isOptimized = useRef(false);

  useEffect(() => {
    if (isOptimized.current) return;
    isOptimized.current = true;

    // تحسين أداء التمرير
    const optimizeScroll = () => {
      let ticking = false;

      const updateScroll = () => {
        // تطبيق will-change للعناصر المرئية
        const visibleElements = document.querySelectorAll('.animate-on-scroll');
        visibleElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.willChange = 'transform, opacity';
          }
        });

        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      };

      const handleScroll = () => {
        requestTick();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };

    // تحسين أداء الصور
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');

      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          // إضافة loading="lazy" للصور
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }

          // إضافة decoding="async"
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }

          // تحسين will-change
          img.style.willChange = 'opacity';
        }
      });
    };

    // تحسين أداء الخطوط
    const optimizeFonts = () => {
      if ('fonts' in document) {
        // إضافة class عند تحميل الخطوط
        document.fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });

        // مراقبة تحميل الخطوط
        document.fonts.addEventListener('loading', () => {
          document.documentElement.classList.add('fonts-loading');
        });

        document.fonts.addEventListener('loadingdone', () => {
          document.documentElement.classList.remove('fonts-loading');
        });
      }
    };

    // تحسين أداء الروابط
    const optimizeLinks = () => {
      const links = document.querySelectorAll('a[href^="/"]');

      links.forEach((link) => {
        if (link instanceof HTMLAnchorElement) {
          // إضافة data-prefetch للروابط
          link.setAttribute('data-prefetch', 'true');

          // تحميل مسبق للروابط المرئية
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const href = entry.target.getAttribute('href');
                if (href) {
                  prefetchPage(href);
                }
                observer.unobserve(entry.target);
              }
            });
          });

          observer.observe(link);
        }
      });
    };

    // تحميل مسبق للصفحات
    const prefetchPage = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    };

    // تحسين أداء CSS
    const optimizeCSS = () => {
      // إضافة CSS variables للأداء
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --scroll-behavior: smooth;
          --transition-duration: 300ms;
          --animation-duration: 500ms;
        }

        html {
          scroll-behavior: var(--scroll-behavior);
        }

        .animate-on-scroll {
          will-change: transform, opacity;
        }

        .lazy-image {
          opacity: 0;
          transition: opacity var(--transition-duration) ease-in-out;
        }

        .lazy-image.loaded {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    };

    // تحسين أداء JavaScript
    const optimizeJavaScript = () => {
      // إضافة Intersection Observer polyfill إذا لزم الأمر
      if (!('IntersectionObserver' in window)) {
        const script = document.createElement('script');
        script.src =
          'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        script.async = true;
        document.head.appendChild(script);
      }

      // إضافة ResizeObserver polyfill إذا لزم الأمر
      if (!('ResizeObserver' in window)) {
        const script = document.createElement('script');
        script.src =
          'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    // تحسين أداء التخزين المؤقت
    const optimizeCaching = () => {
      // إضافة meta tags للتخزين المؤقت
      const metaTags = [
        { name: 'cache-control', content: 'public, max-age=31536000' },
        { name: 'expires', content: '31536000' },
        { name: 'pragma', content: 'cache' },
      ];

      metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    };

    // تطبيق جميع التحسينات
    const applyOptimizations = () => {
      optimizeScroll();
      optimizeImages();
      optimizeFonts();
      optimizeLinks();
      optimizeCSS();
      optimizeJavaScript();
      optimizeCaching();

      // إضافة class للإشارة إلى اكتمال التحسينات
      document.documentElement.classList.add('performance-optimized');
    };

    // تطبيق التحسينات بعد تحميل DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyOptimizations);
    } else {
      applyOptimizations();
    }

    // تطبيق التحسينات عند تغيير الصفحة (SPA)
    const handleRouteChange = () => {
      setTimeout(() => {
        optimizeImages();
        optimizeLinks();
      }, 100);
    };

    // مراقبة تغييرات DOM للصفحات الديناميكية
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // تحسين الصور والروابط الجديدة
              const newImages = node.querySelectorAll('img');
              const newLinks = node.querySelectorAll('a[href^="/"]');

              newImages.forEach((img) => {
                if (img instanceof HTMLImageElement) {
                  img.setAttribute('loading', 'lazy');
                  img.setAttribute('decoding', 'async');
                  img.style.willChange = 'opacity';
                }
              });

              newLinks.forEach((link) => {
                if (link instanceof HTMLAnchorElement) {
                  link.setAttribute('data-prefetch', 'true');
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // تنظيف عند إلغاء المكون
    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;
