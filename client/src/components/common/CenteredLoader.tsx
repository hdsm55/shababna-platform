import React from 'react';

interface CenteredLoaderProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({
  message = 'جاري تحميل الموقع...',
  showProgress = false,
  progress = 0,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-gradient-to-br from-primary-50 via-white to-secondary-50"
      style={{
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-primary-100">
            <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-600 mb-2 drop-shadow-sm">
            شبابنا العالمية
          </h1>
          <p className="text-dark-500 text-lg font-medium">{message}</p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="w-72 h-3 bg-primary-100 rounded-full mx-auto overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-primary-600 text-sm mt-3 font-medium">
              {progress}%
            </p>
          </div>
        )}

        {/* Elegant Loading Animation */}
        <div className="flex justify-center space-x-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-primary-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>

        {/* Motivating Text */}
        <div className="text-dark-400 text-sm font-medium">
          <p className="mb-1">نحن نبني مستقبلاً أفضل معاً</p>
          <p className="text-dark-300">
            We're building a better future together
          </p>
        </div>
      </div>
    </div>
  );
};

export default CenteredLoader;
