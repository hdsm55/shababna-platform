import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load components for better performance
const LazyComponent = lazy(() => import('./LazyImage'));

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  fallback = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  ),
}) => {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 300,
  quality = 80,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const optimizedSrc = React.useMemo(() => {
    // Add image optimization parameters
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    return url.toString();
  }, [src, width, height, quality]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {hasError && (
        <div className="absolute inset-0 bg-error-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-error-500 text-base font-medium">
              الصورة غير متوفرة
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Code splitting utility
export const withCodeSplitting = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export { OptimizedImage };
export default PerformanceOptimizer;
