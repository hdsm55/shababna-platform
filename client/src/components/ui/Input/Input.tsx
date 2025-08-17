import React from 'react';
import { getInputClasses } from '../../common/DesignSystem';

interface InputProps {
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
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
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
  label,
  helperText,
  icon,
  iconPosition = 'left',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          min={min}
          accept={accept}
          className={`
            ${getInputClasses(error, disabled)}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          disabled={disabled}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}
      </div>

      {helperText && (
        <p
          className={`mt-1 text-sm ${
            error ? 'text-error-600' : 'text-neutral-500'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

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
