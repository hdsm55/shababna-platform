import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionHandlerProps {
  children: React.ReactNode;
  onPageChange?: () => void;
  onPageLoad?: () => void;
}

const PageTransitionHandler: React.FC<PageTransitionHandlerProps> = ({
  children,
  onPageChange,
  onPageLoad,
}) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // إذا تغير المسار، ابدأ الانتقال
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);
      setCurrentPath(location.pathname);

      // استدعاء callback عند تغيير الصفحة
      if (onPageChange) {
        onPageChange();
      }

      // تقليل التأخير لإظهار المحتوى سريعًا
      const delay = import.meta.env.MODE === 'development' ? 0 : 80;
      const timer = setTimeout(() => {
        setIsTransitioning(false);

        // استدعاء callback عند تحميل الصفحة
        if (onPageLoad) {
          onPageLoad();
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath, onPageChange, onPageLoad]);

  return (
    <div
      className={`transition-all duration-150 ${
        isTransitioning
          ? 'opacity-0 translate-y-2'
          : 'opacity-100 translate-y-0'
      }`}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransitionHandler;
