import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import UnifiedLoader from './UnifiedLoader';
import Alert from './Alert';

interface BackendIdleHandlerProps {
  children: React.ReactNode;
}

const BackendIdleHandler: React.FC<BackendIdleHandlerProps> = ({
  children,
}) => {
  const [isBackendIdle, setIsBackendIdle] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBackendIdle = (error: any) => {
      if (
        error?.isBackendIdle ||
        error?.code === 'ECONNABORTED' ||
        error?.message?.includes('timeout') ||
        (!error.response && error.message?.includes('Network Error'))
      ) {
        setIsBackendIdle(true);
        setRetryCount((prev) => prev + 1);
        setLastError(error?.message || 'الخادم يستيقظ، يرجى الانتظار...');
      }
    };

    // Listen for backend idle errors
    const originalReject = Promise.prototype.reject;
    Promise.prototype.reject = function (reason) {
      handleBackendIdle(reason);
      return originalReject.call(this, reason);
    };

    return () => {
      Promise.prototype.reject = originalReject;
    };
  }, []);

  const handleRetry = () => {
    setIsBackendIdle(false);
    setRetryCount(0);
    setLastError('');
    queryClient.invalidateQueries();
  };

  const handleAutoRetry = () => {
    // Auto retry after 5 seconds
    setTimeout(() => {
      if (isBackendIdle) {
        handleRetry();
      }
    }, 5000);
  };

  useEffect(() => {
    if (isBackendIdle && retryCount === 1) {
      handleAutoRetry();
    }
  }, [isBackendIdle, retryCount]);

  if (isBackendIdle) {
    return (
      <UnifiedLoader
        variant="modern"
        size="lg"
        fullScreen={true}
        isBackendIdle={true}
        message={lastError}
        showProgress={false}
        showLogo={true}
      />
    );
  }

  return <>{children}</>;
};

export default BackendIdleHandler;
