import React from 'react';
import { theme } from './theme';
import { motion } from 'framer-motion';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'icon'
  | 'loading';

type AsType = 'button' | 'a' | React.ElementType;

interface BaseButtonProps {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
  as?: AsType;
  className?: string;
  [key: string]: any; // لدعم أي prop إضافي مثل to
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BaseButtonProps
>(
  (
    {
      variant = 'primary',
      loading = false,
      icon,
      children,
      dir,
      as = 'button',
      className = '',
      ...props
    },
    ref
  ) => {
    const direction =
      dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';

    const base = `inline-flex items-center justify-center font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow rounded-lg px-4 py-2 gap-2 text-base select-none ${theme.fontFamily.arabic}`;
    const variants: Record<ButtonVariant, string> = {
      primary: `bg-yinmn text-beige hover:bg-yellow hover:text-midnight shadow-sm`,
      outline: `border-2 border-yinmn text-yinmn bg-transparent hover:bg-yinmn hover:text-beige`,
      ghost: `bg-transparent text-yinmn hover:bg-yellow hover:text-midnight`,
      icon: `p-2 bg-yinmn text-beige rounded-full hover:bg-yellow`,
      loading: `bg-indigo text-beige cursor-wait opacity-70`,
    };

    const variantKey: ButtonVariant = loading ? 'loading' : variant;
    const classes = [
      base,
      variants[variantKey],
      direction === 'rtl' ? 'flex-row-reverse' : '',
      className,
    ].join(' ');

    const Comp = as || 'button';
    const isButton = Comp === 'button';
    const isLink = Comp === 'a' || typeof Comp === 'function';

    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        style={{ display: 'inline-block' }}
      >
        <Comp
          ref={ref as any}
          dir={direction}
          className={classes}
          disabled={isButton ? loading || props.disabled : undefined}
          aria-disabled={isLink ? loading || props.disabled : undefined}
          tabIndex={isLink && (loading || props.disabled) ? -1 : undefined}
          {...props}
        >
          {loading ? (
            <span className="animate-spin border-2 border-t-transparent border-neutral rounded-full w-5 h-5 mr-2" />
          ) : icon ? (
            <span className="text-lg">{icon}</span>
          ) : null}
          {children && <span>{children}</span>}
        </Comp>
      </motion.div>
    );
  }
);
Button.displayName = 'Button';
