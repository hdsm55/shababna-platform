import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.svg',
  fallback = '/images/fallback.jpg',
  sizes = '100vw',
  loading = 'lazy',
  onLoad,
  onError,
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [webpSupported, setWebpSupported] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // فحص دعم WebP
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const isWebpSupported =
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    setWebpSupported(isWebpSupported);
  }, []);

  // إنشاء مصادر الصور المحسنة
  const getOptimizedSources = () => {
    if (!src) return [];

    const baseName = src.replace(/\.(jpg|jpeg|png|webp)$/, '');
    const extension = webpSupported ? 'webp' : 'jpg';

    return [
      {
        media: '(min-width: 1200px)',
        srcSet: `${baseName}-large.${extension} 1200w`,
        type: `image/${extension}`,
      },
      {
        media: '(min-width: 768px)',
        srcSet: `${baseName}-medium.${extension} 768w`,
        type: `image/${extension}`,
      },
      {
        media: '(min-width: 480px)',
        srcSet: `${baseName}-small.${extension} 480w`,
        type: `image/${extension}`,
      },
    ];
  };

  // تحميل الصورة
  const loadImage = useRef(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      setImageSrc(fallback);
      setHasError(true);
      onError?.();
    };
  }).current;

  // Intersection Observer للتحميل الكسول
  useEffect(() => {
    if (!imageRef.current || priority) {
      setIsInView(true);
      loadImage();
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            loadImage();
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imageRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority, loadImage]);

  // تنظيف عند تغيير المصدر
  useEffect(() => {
    if (isInView && src) {
      loadImage();
    }
  }, [src, isInView, loadImage]);

  const sources = getOptimizedSources();
  const shouldUsePicture = sources.length > 0 && !hasError;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 animate-pulse"
          />
        )}
      </AnimatePresence>

      {shouldUsePicture ? (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              media={source.media}
              srcSet={source.srcSet}
              type={source.type}
            />
          ))}
          <motion.img
            ref={imageRef}
            src={imageSrc}
            alt={alt}
            sizes={sizes}
            loading={loading}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setImageSrc(fallback);
              setHasError(true);
              onError?.();
            }}
            style={{
              willChange: 'opacity',
            }}
          />
        </picture>
      ) : (
        <motion.img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImageSrc(fallback);
            setHasError(true);
            onError?.();
          }}
          style={{
            willChange: 'opacity',
          }}
        />
      )}

      {/* مؤشر التحميل */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {/* مؤشر الخطأ */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">فشل في تحميل الصورة</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
