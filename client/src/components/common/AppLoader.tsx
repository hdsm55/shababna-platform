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
        variant="brand"
        size="lg"
        fullScreen={true}
        showLogo={true}
        showProgress={false}
        message="جاري تحميل الموقع..."
      />
    );
  }

  return <>{children}</>;
};

export default AppLoader;
