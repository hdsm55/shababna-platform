import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UnifiedLoader from './UnifiedLoader';

/**
 * Page Loading Wrapper - مكون تحميل الصفحات الموحد
 * يظهر تحميل موحد عند الانتقال بين الصفحات
 */
interface PageLoadingWrapperProps {
  children: React.ReactNode;
  loadingDelay?: number;
  variant?: 'default' | 'minimal' | 'brand' | 'modern' | 'elegant';
}

const PageLoadingWrapper: React.FC<PageLoadingWrapperProps> = ({
  children,
  loadingDelay = 200,
  variant = 'default',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // إظهار التحميل عند تغيير الصفحة
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, loadingDelay]);

  if (isLoading) {
    return (
      <UnifiedLoader
        variant={variant}
        size="md"
        fullScreen={true}
        showLogo={variant !== 'minimal'}
        showProgress={false}
        message="جاري تحميل الصفحة..."
        autoHide={true}
        autoHideDelay={loadingDelay}
      />
    );
  }

  return <>{children}</>;
};

export default PageLoadingWrapper;
