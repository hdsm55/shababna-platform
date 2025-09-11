import React, { forwardRef } from 'react';

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
  max?: string;
  step?: string;
  accept?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
      max,
      step,
      accept,
      label,
      helperText,
      icon,
      iconPosition = 'left',
      size = 'md',
      fullWidth = true,
    },
    ref
  ) => {
    const baseClasses =
      'w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
    const sizeClasses = inputSizes[size];
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
    const disabledClasses = disabled
      ? 'bg-gray-100 cursor-not-allowed opacity-50'
      : '';
    const widthClasses = fullWidth ? 'w-full' : '';

    const inputClasses = [
      baseClasses,
      sizeClasses,
      errorClasses,
      disabledClasses,
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            min={min}
            max={max}
            step={step}
            accept={accept}
            className={`
            ${inputClasses}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          `}
            disabled={disabled}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
        </div>

        {helperText && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
export const Textarea: React.FC<
  Omit<InputProps, 'type'> & {
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  }
> = ({
  placeholder,
  value,
  onChange,
  error = false,
  disabled = false,
  className = '',
  name,
  required = false,
  label,
  helperText,
  rows = 4,
  resize = 'vertical',
  size = 'md',
  fullWidth = true,
}) => {
  const baseClasses =
    'w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
  const sizeClasses = inputSizes[size];
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-50'
    : '';
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };
  const widthClasses = fullWidth ? 'w-full' : '';

  const textareaClasses = [
    baseClasses,
    sizeClasses,
    errorClasses,
    disabledClasses,
    resizeClasses[resize],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        rows={rows}
        className={textareaClasses}
        disabled={disabled}
      />

      {helperText && (
        <p
          className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
