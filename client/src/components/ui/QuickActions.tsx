import React from 'react';
import { theme } from './theme';
import { motion } from 'framer-motion';

interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  dir?: 'rtl' | 'ltr';
  grid?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  children,
  dir,
  grid = false,
  className = '',
  ...props
}) => {
  const direction =
    dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'block' }}
    >
      <div
        dir={direction}
        className={`my-4 ${
          grid ? 'grid grid-cols-2 gap-4' : 'flex gap-4'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    </motion.div>
  );
};
