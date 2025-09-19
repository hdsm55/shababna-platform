import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Unified Alert Component - مكون الإشعار الموحد
 * يحل محل جميع مكونات الإشعارات الأخرى ويوفر تجربة موحدة
 */

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface UnifiedAlertProps {
  type: AlertType;
  title?: string;
  message: string;
  position?: 'top-center' | 'top-right' | 'inline' | 'overlay' | 'button-bottom' | 'form-top';
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  autoHide?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UnifiedAlert: React.FC<UnifiedAlertProps> = ({
  type,
  title,
  message,
  position = 'top-center',
  duration = 5000,
  closable = true,
  onClose,
  className = '',
  autoHide = true,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  // إخفاء تلقائي
  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  // الألوان الموحدة حسب نظام التصميم
  const getStyles = () => {
    const baseStyles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
      },
    };

    const sizeStyles = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-sm',
      lg: 'p-5 text-base',
    };

    return { ...baseStyles[type], size: sizeStyles[size] };
  };

  const styles = getStyles();

  // الأيقونات الموحدة
  const getIcon = () => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertTriangle,
      info: Info,
    };
    return icons[type];
  };

  const Icon = getIcon();

  // الحركات الموحدة
  const getAnimation = () => {
    if (position === 'inline') {
      return {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
      };
    }

    return {
      initial: { opacity: 0, y: -50, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -50, scale: 0.9 },
    };
  };

  // المواقع الموحدة
  const getPositionClasses = () => {
    const positions = {
      'top-center':
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4',
      'top-right': 'fixed top-4 right-4 z-50 max-w-sm',
      inline: 'w-full',
      overlay:
        'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
      'button-bottom': 'w-full mt-3',
      'form-top': 'w-full mb-4',
    };
    return positions[position];
  };

  const animation = getAnimation();
  const positionClasses = getPositionClasses();

  const alertContent = (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ duration: 0.3, type: 'spring' }}
      className={`
        ${styles.bg} ${styles.border} ${styles.text} ${styles.size}
        border rounded-lg shadow-lg backdrop-blur-sm
        ${position === 'overlay' ? 'max-w-md w-full' : ''}
        ${className}
      `}
      role="alert"
      aria-live="assertive"
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        {/* الأيقونة */}
        <div className={`${styles.iconBg} rounded-full p-1.5 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${styles.icon}`} />
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          {title && <h3 className="font-semibold mb-1 text-base">{title}</h3>}
          <p className={`${title ? 'text-sm' : 'text-sm'} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* زر الإغلاق */}
        {closable && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
            aria-label={t('common.close', 'إغلاق')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );

  // عرض حسب الموضع
  if (position === 'overlay') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <div onClick={(e) => e.stopPropagation()}>{alertContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && <div className={positionClasses}>{alertContent}</div>}
    </AnimatePresence>
  );
};

export default UnifiedAlert;
