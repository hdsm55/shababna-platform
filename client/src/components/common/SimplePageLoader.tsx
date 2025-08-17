import React from 'react';

interface SimplePageLoaderProps {
  message?: string;
}

const SimplePageLoader: React.FC<SimplePageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
}) => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center max-w-sm mx-auto px-6">
        {/* Elegant Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <p className="text-gray-700 text-lg font-medium">{message}</p>
        </div>

        {/* Subtle Loading Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimplePageLoader;
