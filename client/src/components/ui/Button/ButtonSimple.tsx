import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300',
  secondary:
    'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300',
  outline:
    'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200',
  ghost:
    'bg-transparent text-blue-600 hover:bg-blue-50 transition-all duration-200',
  success:
    'bg-success-500 text-white hover:bg-success-600 shadow-md hover:shadow-lg transition-all duration-300',
  error:
    'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-300',
  warning:
    'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg transition-all duration-300',
  info: 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2 text-base font-medium',
  lg: 'px-6 py-3 text-lg font-medium',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg no-focus-outline';
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}

      {children}

      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};
