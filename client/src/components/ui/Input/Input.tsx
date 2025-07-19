import React from 'react';
import { DESIGN_SYSTEM } from '../../common/DesignSystem';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
  fullWidth?: boolean;
  as?: 'input' | 'select' | 'checkbox';
  options?: { value: string; label: string }[]; // for select
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
      as = 'input',
      options = [],
      type = 'text',
      ...props
    },
    ref
  ) => {
    const direction =
      dir ||
      (typeof document !== 'undefined'
        ? (document.documentElement.dir as 'rtl' | 'ltr')
        : 'rtl');
    const isRtl = direction === 'rtl';
    const widthClass = fullWidth ? 'w-full' : '';
    const baseInput = [
      'block',
      `rounded-md`,
      `border`,
      `bg-white`,
      `text-neutral-900`,
      `placeholder:text-neutral-400`,
      `focus:ring-2 focus:ring-[${DESIGN_SYSTEM.colors.primary}] focus:border-[${DESIGN_SYSTEM.colors.primary}]`,
      'transition-all duration-150',
      'py-2 px-3',
      error
        ? `border-[${DESIGN_SYSTEM.colors.error}] focus:ring-[${DESIGN_SYSTEM.colors.error}] focus:border-[${DESIGN_SYSTEM.colors.error}]`
        : `border-neutral-300`,
      icon ? (isRtl ? 'pr-10' : 'pl-10') : '',
      widthClass,
      className,
    ].join(' ');

    // Checkbox
    if (as === 'checkbox' || type === 'checkbox') {
      return (
        <div
          className={`flex items-center gap-2 ${widthClass}`}
          dir={direction}
        >
          <input
            ref={ref}
            type="checkbox"
            className={[
              'form-checkbox h-5 w-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 transition',
              className,
            ].join(' ')}
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
                error ? 'text-error' : 'text-neutral-500'
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // Select
    if (as === 'select' && options.length > 0) {
      return (
        <div className={`relative ${widthClass}`} dir={direction}>
          {label && (
            <label
              htmlFor={props.id}
              className="block mb-1 font-medium rtl:text-right"
              aria-label={label}
            >
              {label}
            </label>
          )}
          <select
            ref={ref as any}
            className={baseInput + ' appearance-none'}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            dir={direction}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {helperText && !error && (
            <div className="text-xs text-neutral-500 mt-1 rtl:text-right">
              {helperText}
            </div>
          )}
          {error && (
            <div
              id={`${props.id}-error`}
              className="text-xs text-error mt-1 rtl:text-right"
            >
              {error}
            </div>
          )}
        </div>
      );
    }

    // Input عادي
    return (
      <div className={widthClass} dir={direction}>
        {label && (
          <label
            htmlFor={props.id}
            className="block mb-1 font-medium rtl:text-right"
            aria-label={label}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={baseInput}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          dir={direction}
          {...props}
        />
        {helperText && !error && (
          <div className="text-xs text-neutral-500 mt-1 rtl:text-right">
            {helperText}
          </div>
        )}
        {error && (
          <div
            id={`${props.id}-error`}
            className="text-xs text-error mt-1 rtl:text-right"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
