import React from 'react';

interface PageLoadingSpinnerProps {
  message?: string;
}

const PageLoadingSpinner: React.FC<PageLoadingSpinnerProps> = ({
  message = 'جاري تحميل الصفحة...',
}) => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen">
      <div className="text-center max-w-sm mx-auto px-4 flex flex-col items-center justify-center">
        {/* Loading Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg font-medium">{message}</p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoadingSpinner;
