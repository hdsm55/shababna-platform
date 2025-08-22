import React from 'react';
import { CheckCircle, Info, AlertCircle, XCircle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
  dir,
  onClose,
}) => {
  const direction =
    dir ||
    (typeof document !== 'undefined'
      ? (document.documentElement.dir as 'rtl' | 'ltr')
      : 'rtl');
  const isRTL = direction === 'rtl';

  const alertStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[type];

  return (
    <div
      className={`border rounded-lg p-4 ${alertStyles[type]} ${className}`}
      dir={direction}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <Icon
          className={`w-5 h-5 mt-0.5 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          {title && <h3 className="font-medium text-sm mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${
              isRTL ? 'mr-3 ml-0' : ''
            } flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity`}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
