import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'image';
  lines?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  lines = 3, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg shadow-md p-6 animate-pulse ${className}`}>
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'image':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        );
      
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className={`h-4 bg-gray-200 rounded ${index === lines - 1 ? 'w-1/2' : 'w-full'}`}></div>
              </div>
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader; 