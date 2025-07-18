import React from 'react';
import { theme } from '@/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../Button/Button';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  dir?: 'rtl' | 'ltr';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  dir,
  className = '',
  children,
  ...props
}) => {
  const direction =
    dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
  const isRtl = direction === 'rtl';

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" dir={direction}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                className={`
                  relative w-full max-w-lg rounded-xl bg-white shadow-xl
                  ${className}
                `}
                {...props}
              >
                {/* Header */}
                {title && (
                  <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                    <div>
                      <h3
                        className={`text-lg font-medium ${theme.fontFamily.arabic}`}
                      >
                        {title}
                      </h3>
                      {description && (
                        <p
                          className={`mt-1 text-sm text-neutral-500 ${theme.fontFamily.arabic}`}
                        >
                          {description}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-neutral-400 hover:text-neutral-500"
                      aria-label="Close"
                    >
                      ✕
                    </Button>
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-4">{children}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';
