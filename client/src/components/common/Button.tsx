import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'icon'
  | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

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

const baseStyles =
  'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-md';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  icon: 'bg-transparent text-primary-600 p-2 rounded-full hover:bg-primary-50',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

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
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 rtl:ml-2 rtl:mr-0"></span>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
      )}
    </>
  );

  const baseProps = {
    className: clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
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
        whileTap={{ scale: 0.97 }}
        onAnimationStart={() => {}}
      >
        {content}
      </MotionButton>
    );
  }
  // For Link or <a> or custom component
  const MotionComponent = motion(Component);
  // لا تمرر disabled هنا ولا onClick إذا كان معطل
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
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
    >
      {content}
    </MotionComponent>
  );
};

export default Button;
