import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

/**
 * Modern Modal component inspired by Stripe/Linear design
 * Features smooth animations, backdrop blur, and modern styling
 */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  className,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-white p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={clsx(
              'bg-surface rounded-lg shadow-lg max-w-4xl w-full mx-4 p-6 relative my-8',
              className
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {title && (
              <div className="text-xl font-bold mb-4 text-textPrimary rtl:text-right">
                {title}
              </div>
            )}
            <div className="mb-4">{children}</div>
            {actions && <div className="flex justify-end gap-2">{actions}</div>}
            <button
              className="absolute top-3 right-3 rtl:left-3 rtl:right-auto text-secondary hover:text-primary focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
