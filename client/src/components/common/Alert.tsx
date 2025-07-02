import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Modern Alert component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  closable?: boolean;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  className = '',
  children,
  variant = 'default',
  closable = false,
  onClose,
}) => {
  const colorMap = {
    success: {
      default: 'bg-success-50 border-success-200 text-success-800 shadow-sm',
      filled: 'bg-success-600 text-white shadow-md',
      outlined: 'bg-white border-success-500 text-success-700 shadow-sm',
    },
    error: {
      default: 'bg-error-50 border-error-200 text-error-800 shadow-sm',
      filled: 'bg-error-600 text-white shadow-md',
      outlined: 'bg-white border-error-500 text-error-700 shadow-sm',
    },
    warning: {
      default: 'bg-warning-50 border-warning-200 text-warning-800 shadow-sm',
      filled: 'bg-warning-600 text-white shadow-md',
      outlined: 'bg-white border-warning-500 text-warning-700 shadow-sm',
    },
    info: {
      default: 'bg-primary-50 border-primary-200 text-primary-800 shadow-sm',
      filled: 'bg-primary-600 text-white shadow-md',
      outlined: 'bg-white border-primary-500 text-primary-700 shadow-sm',
    },
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const baseClasses =
    'flex items-start gap-3 rounded-xl border p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-sm';
  const colorClasses = colorMap[type][variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`${baseClasses} ${colorClasses} ${className}`}
      role="alert"
    >
      {/* Background pattern for filled variants */}
      {variant === 'filled' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
      )}

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            type === 'success'
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
              : type === 'error'
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)'
              : type === 'warning'
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
      />

      <div className="flex-shrink-0 mt-0.5 relative z-10">{iconMap[type]}</div>
      <div className="flex-1 min-w-0 relative z-10">
        <div className="font-medium leading-relaxed">{message}</div>
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm opacity-90 leading-relaxed"
          >
            {children}
          </motion.div>
        )}
      </div>
      {closable && onClose && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-black/10 transition-all duration-200 relative z-10"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default Alert;
