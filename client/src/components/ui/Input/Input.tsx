import React, { forwardRef } from 'react';
import { theme } from '../../../theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      dir,
      fullWidth = true,
      className = '',
      children,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const direction =
      dir ||
      (typeof document !== 'undefined'
        ? (document?.documentElement?.dir as 'rtl' | 'ltr')
        : 'rtl') ||
      'rtl';
    const isRtl = direction === 'rtl';

    const baseStyles = `
      block
      bg-white
      border rounded-lg
      px-4 py-2
      transition-all duration-200
      placeholder:text-neutral-400
      ${theme.fontFamily.arabic}
    `;

    const states = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500';

    const iconPadding = icon ? (isRtl ? 'pr-10' : 'pl-10') : '';
    const widthClass = fullWidth ? 'w-full' : '';

    // دعم تلقائي للـselect
    if (children && type === 'text') {
      return (
        <div className={`relative ${widthClass}`} dir={direction}>
          {label && (
            <label className="block mb-1 text-sm font-medium text-neutral-900">
              {label}
            </label>
          )}
          <select
            // @ts-ignore
            ref={ref as React.Ref<HTMLSelectElement>}
            className={`
              ${baseStyles}
              ${states}
              ${className}
              appearance-none
            `}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
          {(error || helperText) && (
            <p
              className={`mt-1 text-sm ${
                error ? 'text-red-500' : 'text-neutral-500'
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // دعم input type=checkbox بشكل جمالي
    if (type === 'checkbox') {
      return (
        <div
          className={`flex items-center gap-2 ${widthClass}`}
          dir={direction}
        >
          <input
            ref={ref}
            type="checkbox"
            className={`
              form-checkbox h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition
              ${className}
            `}
            {...props}
          />
          {label && (
            <label className="text-sm font-medium text-neutral-900 select-none cursor-pointer">
              {label}
            </label>
          )}
          {(error || helperText) && (
            <p
              className={`mt-1 text-sm ${
                error ? 'text-red-500' : 'text-neutral-500'
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // input عادي
    return (
      <div className={`relative ${widthClass}`} dir={direction}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-neutral-900">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                isRtl ? 'right-3' : 'left-3'
              } flex items-center pointer-events-none text-neutral-400`}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={`
              ${baseStyles}
              ${states}
              ${iconPadding}
              ${className}
            `}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-500' : 'text-neutral-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
