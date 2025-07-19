import React from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { DESIGN_SYSTEM } from './DesignSystem';
import { motion, AnimatePresence } from 'framer-motion';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

const typeStyles: Record<AlertType, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

const typeIcons: Record<AlertType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
  dir,
}) => {
  const Icon = typeIcons[type];
  const direction =
    dir ||
    (typeof document !== 'undefined'
      ? (document.documentElement.dir as 'rtl' | 'ltr')
      : 'rtl');
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, type: 'spring' }}
        className={[
          'rounded-md border-l-4 p-4 flex items-start gap-3',
          typeStyles[type],
          className,
        ].join(' ')}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        dir={direction}
      >
        <div className="pt-1">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-semibold mb-1 rtl:text-right">{title}</div>
          )}
          {children && <div className="text-sm rtl:text-right">{children}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 ml-2 rtl:mr-2 rtl:ml-0"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
