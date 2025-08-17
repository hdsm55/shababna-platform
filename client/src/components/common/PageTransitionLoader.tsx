import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionLoaderProps {
  children: React.ReactNode;
}

const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // تأخير قصير جداً لإظهار حالة التحميل
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageTransitionLoader;
