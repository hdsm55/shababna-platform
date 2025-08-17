import { useEffect, useCallback } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
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

  // تحسين الأداء للصور
  useEffect(() => {
    // تحسين تحميل الصور
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;
