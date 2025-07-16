import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

export interface AlertProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const variants = {
  success: {
    containerClass: 'bg-green-50 border-green-200',
    titleClass: 'text-green-800',
    textClass: 'text-green-700',
    Icon: CheckCircle,
  },
  warning: {
    containerClass: 'bg-yellow-50 border-yellow-200',
    titleClass: 'text-yellow-800',
    textClass: 'text-yellow-700',
    Icon: AlertTriangle,
  },
  error: {
    containerClass: 'bg-red-50 border-red-200',
    titleClass: 'text-red-800',
    textClass: 'text-red-700',
    Icon: XCircle,
  },
  info: {
    containerClass: 'bg-blue-50 border-blue-200',
    titleClass: 'text-blue-800',
    textClass: 'text-blue-700',
    Icon: AlertCircle,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  children,
  className,
}) => {
  const { containerClass, titleClass, textClass, Icon } = variants[variant];

  return (
    <div className={clsx('rounded-lg border p-4', containerClass, className)}>
      <div className="flex">
        <Icon
          className={clsx('h-5 w-5 flex-shrink-0', textClass)}
          aria-hidden="true"
        />
        <div className="mr-3 w-full">
          {title && (
            <h3 className={clsx('text-sm font-medium', titleClass)}>{title}</h3>
          )}
          {description && (
            <div className={clsx('mt-2 text-sm', textClass)}>{description}</div>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
};
