import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto p-6">
          <LoadingSpinner size="lg" isBackendIdle={true} text={lastError} />

          <Alert type="info" title="الخادم المجاني يستيقظ" className="mt-6">
            الخادم المجاني على Render يستيقظ من النوم بعد فترة من عدم النشاط.
            هذا طبيعي ويستغرق بضع ثوانٍ.
            {retryCount > 1 && (
              <div className="mt-2 text-sm">المحاولة: {retryCount}</div>
            )}
          </Alert>

          {retryCount > 2 && (
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BackendIdleHandler;
