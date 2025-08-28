import React, { useEffect, useCallback } from 'react';

interface PagePerformanceOptimizerProps {
  children: React.ReactNode;
  pageName?: string;
}

const PagePerformanceOptimizer: React.FC<PagePerformanceOptimizerProps> = ({
  children,
  pageName = 'page',
}) => {
  // تحسين الأداء عند التمرير
  const handleScroll = useCallback(() => {
    // تحسين الأداء عند التمرير
    requestAnimationFrame(() => {
      // يمكن إضافة منطق إضافي هنا
    });
  }, []);

  // تحسين الأداء عند تغيير الحجم
  const handleResize = useCallback(() => {
    // تحسين الأداء عند تغيير الحجم
    requestAnimationFrame(() => {
      // يمكن إضافة منطق إضافي هنا
    });
  }, []);

  useEffect(() => {
    // إضافة مستمعي الأحداث مع throttling
    let scrollTimeout: number;
    let resizeTimeout: number;

    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = window.setTimeout(() => {
        handleScroll();
        scrollTimeout = 0;
      }, 16); // ~60fps
    };

    const throttledResize = () => {
      if (resizeTimeout) return;
      resizeTimeout = window.setTimeout(() => {
        handleResize();
        resizeTimeout = 0;
      }, 100);
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', throttledResize, { passive: true });

    // تنظيف
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledResize);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [handleScroll, handleResize]);

  // تحسين الأداء للصور في هذه الصفحة
  useEffect(() => {
    // تحسين تحميل الصور
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: '150px',
        threshold: 0.01,
      }
    );

    images.forEach((img) => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  // تحسين الأداء للخطوط
  useEffect(() => {
    // تحسين تحميل الخطوط
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
  }, []);

  // تحسين الأداء للروابط
  useEffect(() => {
    // تحسين تحميل الروابط
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        link.setAttribute('data-prefetch', 'true');
      }
    });
  }, []);

  return <>{children}</>;
};

export default PagePerformanceOptimizer;


