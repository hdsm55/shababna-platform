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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="text-center max-w-md mx-auto p-6">
          {/* Brand Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">ش</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">
              شبابنا العالمية
            </h2>
            <p className="text-xs text-primary-200">
              منصة الشباب المسلم العالمية
            </p>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 border-primary-300 border-t-accent-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-accent-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white mb-2">
              الخادم يستيقظ
            </h3>
            <p className="text-xs text-primary-200 leading-relaxed">
              {lastError}
            </p>
          </div>

          {/* Info Alert */}
          <div className="mb-6">
            <div className="bg-primary-800/50 border border-primary-600 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-accent-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mr-3">
                  <h4 className="text-xs font-medium text-white">
                    الخادم المجاني يستيقظ
                  </h4>
                  <p className="text-xs text-primary-300 mt-1">
                    الخادم المجاني على Render يستيقظ من النوم بعد فترة من عدم
                    النشاط. هذا طبيعي ويستغرق بضع ثوانٍ.
                  </p>
                  {retryCount > 1 && (
                    <div className="text-xs text-accent-400 mt-2 font-medium">
                      المحاولة: {retryCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Retry Button */}
          {retryCount > 2 && (
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-primary-900"
            >
              إعادة المحاولة
            </button>
          )}

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-center space-x-1 space-x-reverse">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    retryCount >= step ? 'bg-accent-500' : 'bg-primary-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BackendIdleHandler;
