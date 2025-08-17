import React from 'react';
import { tokens } from '../../theme/tokens';

// ===== نظام الألوان الموحد =====
export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      main: tokens.colors.primary.main,
      light: tokens.colors.primary.light,
      dark: tokens.colors.primary.dark,
      50: tokens.colors.primary[50],
      100: tokens.colors.primary[100],
      200: tokens.colors.primary[200],
      300: tokens.colors.primary[300],
      400: tokens.colors.primary[400],
      500: tokens.colors.primary[500],
      600: tokens.colors.primary[600],
      700: tokens.colors.primary[700],
      800: tokens.colors.primary[800],
      900: tokens.colors.primary[900],
    },
    accent: {
      main: tokens.colors.accent.main,
      light: tokens.colors.accent.light,
      dark: tokens.colors.accent.dark,
      50: tokens.colors.accent[50],
      100: tokens.colors.accent[100],
      200: tokens.colors.accent[200],
      300: tokens.colors.accent[300],
      400: tokens.colors.accent[400],
      500: tokens.colors.accent[500],
      600: tokens.colors.accent[600],
      700: tokens.colors.accent[700],
      800: tokens.colors.accent[800],
      900: tokens.colors.accent[900],
    },
    success: tokens.colors.semantic.success,
    error: tokens.colors.semantic.error,
    warning: tokens.colors.semantic.warning,
    info: tokens.colors.semantic.info,
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  typography: {
    fonts: {
      arabic: 'Cairo, Tahoma, Arial, sans-serif',
      latin: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

// ===== أنماط البطاقات الموحدة =====
export const getCardClasses = (
  variant: 'default' | 'elevated' | 'outlined' | 'interactive' = 'default'
) => {
  const baseClasses = 'rounded-xl border transition-all duration-250';

  switch (variant) {
    case 'elevated':
      return `${baseClasses} bg-white border-neutral-200 shadow-lg hover:shadow-xl`;
    case 'outlined':
      return `${baseClasses} bg-white border-neutral-300 hover:border-primary-400`;
    case 'interactive':
      return `${baseClasses} bg-white border-neutral-200 shadow-md hover:shadow-lg hover:border-primary-300 cursor-pointer transform hover:-translate-y-1`;
    default:
      return `${baseClasses} bg-white border-neutral-200 shadow-sm`;
  }
};

// ===== أنماط الأزرار الموحدة =====
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false
) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg`,
    secondary: `bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500`,
    outline: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500`,
    ghost: `text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500`,
    danger: `bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-md hover:shadow-lg`,
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

// ===== أنماط النماذج الموحدة =====
export const getInputClasses = (
  error: boolean = false,
  disabled: boolean = false
) => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';

  if (disabled) {
    return `${baseClasses} bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed`;
  }

  if (error) {
    return `${baseClasses} border-error-300 focus:border-error-500 focus:ring-error-200 bg-error-50`;
  }

  return `${baseClasses} border-neutral-300 focus:border-primary-500 focus:ring-primary-200 hover:border-neutral-400`;
};

// ===== أنماط التنبيهات الموحدة =====
export const getAlertClasses = (
  type: 'success' | 'error' | 'warning' | 'info'
) => {
  const baseClasses = 'p-4 rounded-lg border-l-4';

  const typeClasses = {
    success: 'bg-success-50 border-success-500 text-success-800',
    error: 'bg-error-50 border-error-500 text-error-800',
    warning: 'bg-warning-50 border-warning-500 text-warning-800',
    info: 'bg-info-50 border-info-500 text-info-800',
  };

  return `${baseClasses} ${typeClasses[type]}`;
};

// ===== أنماط البادج الموحدة =====
export const getBadgeClasses = (
  variant: 'default' | 'success' | 'warning' | 'error' | 'info'
) => {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-info-100 text-info-800',
  };

  return `${baseClasses} ${variantClasses[variant]}`;
};

// ===== مكونات التصميم الموحدة =====

// بطاقة موحدة
export const Card: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'default', className = '', onClick }) => {
  return (
    <div
      className={`${getCardClasses(variant)} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// زر موحد
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${getButtonClasses(variant, size, disabled)} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// حقل إدخال موحد
export const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
  min?: string;
  accept?: string;
}> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  disabled = false,
  className = '',
  name,
  required = false,
  min,
  accept,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      min={min}
      accept={accept}
      className={`${getInputClasses(error, disabled)} ${className}`}
      disabled={disabled}
    />
  );
};

// تنبيه موحد
export const Alert: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  className?: string;
}> = ({ type, title, description, className = '' }) => {
  return (
    <div className={`${getAlertClasses(type)} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{/* أيقونة حسب النوع */}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <div className="mt-2 text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// بادج موحد
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`${getBadgeClasses(variant)} ${className}`}>
      {children}
    </span>
  );
};

// ===== أنماط التخطيط الموحدة =====
export const getLayoutClasses = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 lg:py-16',
  grid: {
    '2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
  },
};

// ===== أنماط النصوص الموحدة =====
export const getTextClasses = {
  h1: 'text-4xl lg:text-5xl font-bold text-neutral-900',
  h2: 'text-3xl lg:text-4xl font-bold text-neutral-900',
  h3: 'text-2xl lg:text-3xl font-semibold text-neutral-900',
  h4: 'text-xl lg:text-2xl font-semibold text-neutral-900',
  h5: 'text-lg lg:text-xl font-medium text-neutral-900',
  h6: 'text-base lg:text-lg font-medium text-neutral-900',
  body: 'text-base text-neutral-700',
  small: 'text-sm text-neutral-600',
  caption: 'text-xs text-neutral-500',
};

export default DESIGN_SYSTEM;
