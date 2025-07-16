import React from 'react';
import { theme } from './theme';
import { motion } from 'framer-motion';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  dir?: 'rtl' | 'ltr';
  children?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  dir,
  children,
  className = '',
  ...props
}) => {
  const direction =
    dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'block' }}
    >
      <div dir={direction} className={`mb-6 ${className}`} {...props}>
        <h2
          className={`text-2xl font-bold text-primary mb-1 ${theme.fontFamily.arabic}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`text-secondary mb-2 ${theme.fontFamily.arabic}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    </motion.div>
  );
};
