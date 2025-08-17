import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={`bg-gray-200 animate-pulse ${width} ${height} ${roundedClasses[rounded]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

// Skeleton Components for common UI patterns
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={index === lines - 1 ? 'h-3' : 'h-4'}
          width={index === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="space-y-4">
        <Skeleton height="h-6" width="w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex space-x-2">
          <Skeleton height="h-8" width="w-20" />
          <Skeleton height="h-8" width="w-20" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton className={sizeClasses[size]} rounded="full" />;
};

export const SkeletonButton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return <Skeleton className={sizeClasses[size]} />;
};

export const SkeletonInput: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return <Skeleton className={`h-10 ${className}`} />;
};

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} height="h-4" width="w-20" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="h-4" width="w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonEventCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <Skeleton height="h-48" className="w-full" />
      <div className="p-6 space-y-4">
        <Skeleton height="h-6" width="w-3/4" />
        <SkeletonText lines={2} />
        <div className="flex items-center space-x-4">
          <Skeleton height="h-4" width="w-20" />
          <Skeleton height="h-4" width="w-16" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonButton size="sm" />
          <Skeleton height="h-4" width="w-24" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonProgramCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <Skeleton height="h-40" className="w-full" />
      <div className="p-6 space-y-4">
        <Skeleton height="h-6" width="w-2/3" />
        <SkeletonText lines={3} />
        <div className="flex items-center space-x-4">
          <Skeleton height="h-4" width="w-24" />
          <Skeleton height="h-4" width="w-20" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonButton size="sm" />
          <div className="flex space-x-2">
            <Skeleton height="h-6" width="w-12" rounded="full" />
            <Skeleton height="h-6" width="w-12" rounded="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonBlogCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <Skeleton height="h-48" className="w-full" />
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <SkeletonAvatar size="sm" />
          <Skeleton height="h-4" width="w-24" />
        </div>
        <Skeleton height="h-6" width="w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex justify-between items-center">
          <Skeleton height="h-4" width="w-20" />
          <div className="flex space-x-2">
            <Skeleton height="h-6" width="w-12" rounded="full" />
            <Skeleton height="h-6" width="w-12" rounded="full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{
  items: number;
  component: React.ComponentType<{ className?: string }>;
  className?: string;
}> = ({ items, component: Component, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

export const SkeletonList: React.FC<{
  items: number;
  component: React.ComponentType<{ className?: string }>;
  className?: string;
}> = ({ items, component: Component, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonTable,
  SkeletonEventCard,
  SkeletonProgramCard,
  SkeletonBlogCard,
  SkeletonGrid,
  SkeletonList,
};
