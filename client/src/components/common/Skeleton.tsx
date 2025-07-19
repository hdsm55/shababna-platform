import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle,
  className = '',
  style,
}) => {
  return (
    <span
      className={[
        'relative overflow-hidden bg-neutral-200 animate-pulse block',
        circle ? 'rounded-full' : 'rounded-md',
        className,
      ].join(' ')}
      style={{
        width,
        height,
        ...style,
      }}
      aria-busy="true"
      aria-label="جارٍ التحميل"
    >
      <span
        className="absolute inset-0 block bg-gradient-to-r from-transparent via-neutral-100 to-transparent animate-shimmer"
        style={{
          animationDuration: '1.2s',
        }}
      />
    </span>
  );
};

export default Skeleton;

// CSS (يجب إضافته في index.css أو ملف CSS عام):
// .animate-shimmer {
//   animation: shimmer 1.2s infinite linear;
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
