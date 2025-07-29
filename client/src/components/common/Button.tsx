import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { getButtonClasses } from './DesignSystem';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: React.ElementType;
  to?: string; // for Link
  href?: string; // for <a>
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  as: Component = 'button',
  to,
  href,
  ...props
}) => {
  const content = (
    <>
      {loading ? (
        <div className="flex items-center">
          <svg
            className="w-4 h-4 animate-spin mr-2 rtl:ml-2 rtl:mr-0"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
          )}
        </>
      )}
    </>
  );

  const baseProps = {
    className: clsx(
      getButtonClasses(variant, size),
      fullWidth && 'w-full',
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
      className
    ),
    ...props,
  };

  if (Component === 'button') {
    const MotionButton = motion.button;
    return (
      <MotionButton
        type="button"
        {...baseProps}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </MotionButton>
    );
  }

  // For Link or <a> or custom component
  const MotionComponent = motion(Component);
  const { onClick, disabled: _d, ...restProps } = baseProps;

  const handleClick = (e: React.MouseEvent<any, MouseEvent>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <MotionComponent
      {...restProps}
      to={to}
      href={href}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      {content}
    </MotionComponent>
  );
};

export default Button;
