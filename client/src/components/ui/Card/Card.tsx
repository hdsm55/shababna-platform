import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  padding = 'md',
  header,
  footer,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-md',
    elevated: 'bg-white rounded-lg shadow-lg',
    outlined: 'bg-white border-2 border-gray-300 rounded-lg',
    interactive:
      'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {header && (
        <div className="border-b border-gray-200 pb-4 mb-4">{header}</div>
      )}

      <div className="flex-1">{children}</div>

      {footer && (
        <div className="border-t border-gray-200 pt-4 mt-4">{footer}</div>
      )}
    </div>
  );
};

// إضافة Card Header component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pb-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

// إضافة Card Body component
export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

// إضافة Card Footer component
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pt-4 border-t border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

// إضافة Card Title component
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}> = ({ children, className = '', level = 3 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={`text-lg font-semibold text-neutral-900 mb-2 ${className}`}>
      {children}
    </Tag>
  );
};

// إضافة Card Subtitle component
export const CardSubtitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm text-neutral-600 ${className}`}>{children}</div>
  );
};

// إضافة Card Image component
export const CardImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  return (
    <div className={`w-full h-48 object-cover rounded-t-lg ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

// إضافة Card Actions component
export const CardActions: React.FC<{
  children: React.ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right' | 'between';
}> = ({ children, className = '', alignment = 'right' }) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-2 ${alignmentClasses[alignment]} ${className}`}
    >
      {children}
    </div>
  );
};

// إضافة Card Stats component
export const CardStats: React.FC<{
  items: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: 'primary' | 'accent' | 'success' | 'error' | 'warning' | 'info';
  }>;
  className?: string;
}> = ({ items, className = '' }) => {
  const colorClasses = {
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-info-600',
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          {item.icon && (
            <div
              className={`p-2 rounded-lg bg-neutral-100 ${
                colorClasses[item.color || 'primary']
              }`}
            >
              {item.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-neutral-600">{item.label}</p>
            <p className="text-lg font-semibold text-neutral-900">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
