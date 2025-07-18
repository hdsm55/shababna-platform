import React from 'react';
import { theme } from './theme';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  dir?: 'rtl' | 'ltr';
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, dir, label, className = '', ...props }, ref) => {
    const direction =
      dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
    const isRtl = direction === 'rtl';

    const base = `block w-full bg-neutral text-dark border border-secondary rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 ${theme.fontFamily.arabic}`;
    const errorClass = error ? 'border-red-500 focus:ring-red-400' : '';
    const iconPadding = icon ? (isRtl ? 'pr-10' : 'pl-10') : '';

    return (
      <div className={`mb-4 w-full ${direction}`}>
        {label && (
          <label
            className={`block mb-1 font-bold ${theme.fontFamily.arabic}`}
            dir={direction}
          >
            {label}
          </label>
        )}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'relative' }}
        >
          {icon && (
            <span
              className={`absolute top-1/2 ${
                isRtl ? 'right-3' : 'left-3'
              } -translate-y-1/2 text-xl text-secondary pointer-events-none`}
              dir={direction}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            dir={direction}
            className={`${base} ${iconPadding} ${errorClass} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </motion.div>
        {error && (
          <span
            id={`${props.id}-error`}
            className="text-red-600 text-sm mt-1 block"
            dir={direction}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
