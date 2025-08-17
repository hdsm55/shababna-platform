import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface InstantLoaderProps {
  children: React.ReactNode;
}

const InstantLoader: React.FC<InstantLoaderProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // تحميل فوري بدون تأخير
    setIsLoading(false);
  }, [location.pathname]);

  // إظهار المحتوى فوراً
  return <>{children}</>;
};

export default InstantLoader;
