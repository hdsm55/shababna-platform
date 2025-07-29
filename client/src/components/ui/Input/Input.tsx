import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { getInputClasses } from '../../common/DesignSystem';

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

// Input sizes
const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

// Input variants
const inputVariants = {
  default: 'bg-white border border-neutral-300',
  outlined: 'bg-transparent border-2 border-neutral-300',
  filled: 'bg-neutral-50 border border-neutral-300',
  ghost: 'bg-transparent border-b-2 border-neutral-300 rounded-none',
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
    const baseClasses = getInputClasses(currentState);
    const variantClasses = inputVariants[variant];
    const sizeClasses = inputSizes[size];
    const widthClasses = fullWidth ? 'w-full' : '';

    const inputClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      'transition-all duration-200 placeholder-neutral-400',
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
            className="block text-sm font-medium text-neutral-700 mb-2"
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

  const baseClasses = getInputClasses(currentState);
  const variantClasses = inputVariants[variant];
  const sizeClasses = inputSizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';
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
    widthClasses,
    resizeClasses[resize],
    'transition-all duration-200 placeholder-neutral-400',
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

  const baseClasses = getInputClasses(currentState);
  const variantClasses = inputVariants[variant];
  const sizeClasses = inputSizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';

  const selectClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    'transition-all duration-200',
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

// إضافة Checkbox component
export const Checkbox: React.FC<
  Omit<InputProps, 'children'> & {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
  }
> = ({
  label,
  helperText,
  error,
  success,
  fullWidth = false,
  className = '',
  checked = false,
  onChange,
  ...props
}) => {
  const currentState = error ? 'error' : success ? 'success' : 'default';

  const checkboxClasses = [
    'w-4 h-4 text-primary-600 bg-white border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    currentState === 'error' && 'border-error-500 focus:ring-error-500',
    currentState === 'success' && 'border-success-500 focus:ring-success-500',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <div className="flex items-center">
        <motion.input
          type="checkbox"
          className={checkboxClasses}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          {...props}
        />
        {label && (
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-2 text-sm font-medium text-neutral-700 cursor-pointer"
          >
            {label}
          </motion.label>
        )}
      </div>

      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-neutral-500 mt-1 ml-6"
        >
          {helperText}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-1 ml-6"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-success-600 mt-1 ml-6"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
};

// إضافة Radio component
export const Radio: React.FC<
  Omit<InputProps, 'children'> & {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    name?: string;
  }
> = ({
  label,
  helperText,
  error,
  success,
  fullWidth = false,
  className = '',
  checked = false,
  onChange,
  name,
  ...props
}) => {
  const currentState = error ? 'error' : success ? 'success' : 'default';

  const radioClasses = [
    'w-4 h-4 text-primary-600 bg-white border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    currentState === 'error' && 'border-error-500 focus:ring-error-500',
    currentState === 'success' && 'border-success-500 focus:ring-success-500',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <div className="flex items-center">
        <motion.input
          type="radio"
          className={radioClasses}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          name={name}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          {...props}
        />
        {label && (
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-2 text-sm font-medium text-neutral-700 cursor-pointer"
          >
            {label}
          </motion.label>
        )}
      </div>

      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-neutral-500 mt-1 ml-6"
        >
          {helperText}
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-1 ml-6"
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-success-600 mt-1 ml-6"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
