import React from 'react';
import LazyImage from '../../common/LazyImage';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '/images/fallback.svg',
  placeholder = '/images/placeholder.svg',
}) => {
  return (
    <div className={`w-full h-48 overflow-hidden rounded-t-lg ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        fallback={fallback}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CardImage;


