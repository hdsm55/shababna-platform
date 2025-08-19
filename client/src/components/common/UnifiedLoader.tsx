import React from 'react';
import clsx from 'clsx';

interface UnifiedLoaderProps {
  type?: 'spinner' | 'centered' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  isBackendIdle?: boolean;
  showProgress?: boolean;
  progress?: number;
  message?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  className,
  isBackendIdle = false,
  showProgress = false,
  progress = 0,
  message = 'جاري تحميل الموقع...',
}) => {
  // Spinner Component
  const SpinnerComponent = () => (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            'inline-block animate-spin rounded-full border-2 border-primary-300 border-t-accent-500',
            sizeMap[size]
          )}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <span className="text-dark-500 text-sm rtl:text-right">{text}</span>
        )}
      </div>
      {isBackendIdle && (
        <div className="text-center">
          <p className="text-sm text-dark-400 mb-2">
            الخادم المجاني يستيقظ من النوم
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  // Centered Component
  const CenteredComponent = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
      style={{
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <div className="text-center max-w-md mx-auto px-6">
        {/* Brand Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white text-2xl font-bold">ش</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
            شبابنا العالمية
          </h1>
          <p className="text-primary-200 text-base font-medium">{message}</p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="w-72 h-3 bg-primary-800 rounded-full mx-auto overflow-hidden shadow-inner border border-primary-600">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-accent-400 text-sm mt-3 font-medium">
              {progress}%
            </p>
          </div>
        )}

        {/* Elegant Loading Animation */}
        <div className="flex justify-center space-x-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-accent-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>

        {/* Motivating Text */}
        <div className="text-primary-200 text-sm font-medium">
          <p className="mb-1">نحن نبني مستقبلاً أفضل معاً</p>
          <p className="text-primary-300">
            We're building a better future together
          </p>
        </div>
      </div>
    </div>
  );

  // Inline Component
  const InlineComponent = () => (
    <div className={clsx('flex items-center justify-center py-8', className)}>
      <SpinnerComponent />
    </div>
  );

  // Return appropriate component based on type
  switch (type) {
    case 'centered':
      return <CenteredComponent />;
    case 'inline':
      return <InlineComponent />;
    case 'spinner':
    default:
      return <SpinnerComponent />;
  }
};

export default UnifiedLoader;
