import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FastPageLoaderProps {
  children: React.ReactNode;
}

const FastPageLoader: React.FC<FastPageLoaderProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // تأخير قصير جداً
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FastPageLoader;
