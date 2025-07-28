import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { tokens, microInteractions } from '../../../theme/tokens';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  state?: 'default' | 'error' | 'success' | 'warning' | 'info';
  children?: React.ReactNode;
}

// Input states مع التحسينات الجديدة
const inputStates = {
  default:
    'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
  error:
    'border-error-300 focus:border-error-500 focus:ring-2 focus:ring-error-200',
  success:
    'border-success-300 focus:border-success-500 focus:ring-2 focus:ring-success-200',
  warning:
    'border-warning-300 focus:border-warning-500 focus:ring-2 focus:ring-warning-200',
  info: 'border-info-300 focus:border-info-500 focus:ring-2 focus:ring-info-200',
};

// Input variants مع التحسينات الجديدة
const inputVariants = {
  default: 'bg-white border border-neutral-300',
  outlined: 'bg-transparent border-2 border-neutral-300',
  filled: 'bg-neutral-50 border border-neutral-300',
  ghost: 'bg-transparent border-b-2 border-neutral-300 rounded-none',
};

// Input sizes مع التحسينات الجديدة
const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

// Text colors للـ states
const textColors = {
  default: 'text-neutral-900',
  error: 'text-error-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  info: 'text-info-600',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      size = 'md',
      variant = 'default',
      state = 'default',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // تحديد الـ state بناء على الـ props
    const currentState = error ? 'error' : success ? 'success' : state;

    // تجميع classes
    const baseClasses =
      'rounded-lg transition-all duration-200 focus:outline-none placeholder-neutral-400';

    const variantClasses = inputVariants[variant];
    const sizeClasses = inputSizes[size];
    const stateClasses = inputStates[currentState];
    const widthClasses = fullWidth ? 'w-full' : '';
    const microClasses = microInteractions.inputFocus;

    const inputClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      stateClasses,
      widthClasses,
      microClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Icon wrapper مع animation
    const IconWrapper = ({
      children,
      position,
    }: {
      children: React.ReactNode;
      position: 'left' | 'right';
    }) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 text-neutral-400 ${
          position === 'left' ? 'left-3' : 'right-3'
        }`}
      >
        {children}
      </motion.div>
    );

    // Helper text component
    const HelperText = ({
      text,
      type,
    }: {
      text: string;
      type: 'helper' | 'error' | 'success';
    }) => {
      const colorClasses = {
        helper: 'text-neutral-500',
        error: 'text-error-600',
        success: 'text-success-600',
      };

      return (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm mt-1 ${colorClasses[type]}`}
        >
          {text}
        </motion.p>
      );
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`block text-sm font-medium text-neutral-700 mb-2`}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <IconWrapper position="left">{icon}</IconWrapper>
          )}

          <motion.input
            ref={ref}
            className={`${inputClasses} ${
              icon && iconPosition === 'left' ? 'pl-10' : ''
            } ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <IconWrapper position="right">{icon}</IconWrapper>
          )}
        </div>

        {/* Helper texts */}
        {helperText && <HelperText text={helperText} type="helper" />}
        {error && <HelperText text={error} type="error" />}
        {success && <HelperText text={success} type="success" />}

        {children}
      </div>
    );
  }
);

Input.displayName = 'Input';

// إضافة Textarea component
export const Textarea: React.FC<
  Omit<InputProps, 'children'> & {
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  }
> = ({
  label,
  helperText,
  error,
  success,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  variant = 'default',
  state = 'default',
  className = '',
  rows = 3,
  resize = 'vertical',
  ...props
}) => {
  const currentState = error ? 'error' : success ? 'success' : state;

  const baseClasses =
    'rounded-lg transition-all duration-200 focus:outline-none placeholder-neutral-400 resize-none';
  const variantClasses = inputVariants[variant];
  const sizeClasses = inputSizes[size];
  const stateClasses = inputStates[currentState];
  const widthClasses = fullWidth ? 'w-full' : '';
  const microClasses = microInteractions.inputFocus;
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const textareaClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    widthClasses,
    microClasses,
    resizeClasses[resize],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
        </motion.label>
      )}

      <motion.textarea
        className={textareaClasses}
        rows={rows}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      />

      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-neutral-500 mt-1"
        >
          {helperText}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-1"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-success-600 mt-1"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
};

// إضافة Select component
export const Select: React.FC<
  Omit<InputProps, 'children'> & {
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
  }
> = ({
  label,
  helperText,
  error,
  success,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'md',
  variant = 'default',
  state = 'default',
  className = '',
  options,
  placeholder,
  ...props
}) => {
  const currentState = error ? 'error' : success ? 'success' : state;

  const baseClasses =
    'rounded-lg transition-all duration-200 focus:outline-none';
  const variantClasses = inputVariants[variant];
  const sizeClasses = inputSizes[size];
  const stateClasses = inputStates[currentState];
  const widthClasses = fullWidth ? 'w-full' : '';
  const microClasses = microInteractions.inputFocus;

  const selectClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    widthClasses,
    microClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 text-neutral-400">
            {icon}
          </div>
        )}

        <motion.select
          className={`${selectClasses} ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </motion.select>

        {icon && iconPosition === 'right' && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 text-neutral-400">
            {icon}
          </div>
        )}
      </div>

      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-neutral-500 mt-1"
        >
          {helperText}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-1"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-success-600 mt-1"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
