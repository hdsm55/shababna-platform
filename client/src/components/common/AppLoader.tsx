import React, { useState, useEffect } from 'react';
import UnifiedLoader from './UnifiedLoader';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحميل شبه فوري: بدون تأخير في التطوير و80ms في الإنتاج
    const delay = import.meta.env.MODE === 'development' ? 0 : 80;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <UnifiedLoader
        type="centered"
        message="جاري تحميل الموقع..."
        showProgress={false}
        progress={0}
      />
    );
  }

  return <>{children}</>;
};

export default AppLoader;
