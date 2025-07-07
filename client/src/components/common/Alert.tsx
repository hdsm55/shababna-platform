import React from 'react';
import clsx from 'clsx';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

/**
 * Modern Alert component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const typeStyles: Record<AlertType, string> = {
  info: 'bg-info/10 text-info border-info',
  success: 'bg-success/10 text-success border-success',
  warning: 'bg-warning/10 text-warning border-warning',
  error: 'bg-error/10 text-error border-error',
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
}) => {
  const Icon = typeIcons[type];
  return (
    <div
      className={clsx(
        'rounded-md border-l-4 p-4 flex items-start gap-3',
        typeStyles[type],
        className
      )}
      role="alert"
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
          className="text-secondary hover:text-primary ml-2 rtl:mr-2 rtl:ml-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
