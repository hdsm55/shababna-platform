import React, { useState, useEffect } from 'react';
import CenteredLoader from './CenteredLoader';

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
      <CenteredLoader
        message="جاري تحميل الموقع..."
        showProgress={false}
        progress={0}
      />
    );
  }

  return <>{children}</>;
};

export default AppLoader;
