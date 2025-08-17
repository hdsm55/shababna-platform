import React, { useState, useEffect } from 'react';

interface PageContentLoaderProps {
  children: React.ReactNode;
  delay?: number;
}

const PageContentLoader: React.FC<PageContentLoaderProps> = ({
  children,
  delay = 800,
}) => {
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    // إخفاء الفوتر مؤقتاً
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // تأخير لإظهار المحتوى
    const timer = setTimeout(() => {
      setIsContentReady(true);

      // إظهار الفوتر بعد تحميل المحتوى
      if (footer) {
        footer.style.display = '';
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      // إعادة إظهار الفوتر في حالة unmount
      if (footer) {
        footer.style.display = '';
      }
    };
  }, [delay]);

  if (!isContentReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageContentLoader;
