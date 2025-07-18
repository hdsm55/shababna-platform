import React from 'react';
import { theme } from './theme';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  dir?: 'rtl' | 'ltr';
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  dir,
  children,
  className = '',
  ...props
}) => {
  const direction =
    dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          dir={direction}
        >
          <motion.div
            className={`bg-neutral rounded-lg shadow-lg max-w-lg w-full p-6 relative ${theme.fontFamily.arabic} ${className}`}
            initial={{ scale: 0.95, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 40 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="text-dark hover:text-primary text-2xl font-bold px-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  ×
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
