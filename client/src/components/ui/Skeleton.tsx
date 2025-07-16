import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  circle = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      style={{ display: 'block' }}
    >
      <div
        className={`bg-neutral animate-pulse ${
          circle ? 'rounded-full' : 'rounded-lg'
        } ${className}`}
        style={{ width, height, ...style }}
        {...props}
      />
    </motion.div>
  );
};
