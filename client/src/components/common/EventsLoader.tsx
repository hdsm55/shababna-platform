import React from 'react';

interface EventsLoaderProps {
  message?: string;
}

const EventsLoader: React.FC<EventsLoaderProps> = ({
  message = 'جاري تحميل الفعاليات...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Loading Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-8 max-w-sm w-full">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary-600 mb-2">
            {message}
          </h3>
          <p className="text-dark-400 text-sm">يرجى الانتظار قليلاً...</p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsLoader;
