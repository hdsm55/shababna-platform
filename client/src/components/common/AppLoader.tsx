import React, { useState, useEffect } from 'react';
import UnifiedLoader from './UnifiedLoader';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تحميل فوري وسريع
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

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
