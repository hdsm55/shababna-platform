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
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBackendIdle = (error: any) => {
      if (error?.isBackendIdle) {
        setIsBackendIdle(true);
        setRetryCount((prev) => prev + 1);
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
    queryClient.invalidateQueries();
  };

  if (isBackendIdle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto p-6">
          <LoadingSpinner
            size="lg"
            isBackendIdle={true}
            text="الخادم يستيقظ، يرجى الانتظار..."
          />

          <Alert type="info" title="الخادم المجاني يستيقظ" className="mt-6">
            الخادم المجاني على Render يستيقظ من النوم بعد فترة من عدم النشاط.
            هذا طبيعي ويستغرق بضع ثوانٍ.
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
