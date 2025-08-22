import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface InstantLoaderProps {
  children: React.ReactNode;
  onContentLoad?: () => void;
}

const InstantLoader: React.FC<InstantLoaderProps> = ({
  children,
  onContentLoad,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // إعادة تعيين الحالة عند تغيير الصفحة
    setIsLoading(true);
    setContentReady(false);

    // تقليل التأخير قدر الإمكان
    const delay = import.meta.env.MODE === 'development' ? 0 : 60;
    const timer = setTimeout(() => {
      setIsLoading(false);
      setContentReady(true);

      // استدعاء callback عند تحميل المحتوى
      if (onContentLoad) {
        onContentLoad();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, onContentLoad]);

  // إظهار المحتوى مع تأثير انتقالي بسيط
  return (
    <div
      className={`transition-opacity duration-150 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
};

export default InstantLoader;
