import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  SECTION_VARIANTS,
} from './DesignSystem';

// Accessible Button Component
interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-md';

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const content = (
    <>
      {loading ? (
        <span
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 rtl:ml-2 rtl:mr-0"
          aria-hidden="true"
        ></span>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" aria-hidden="true" />
      )}
    </>
  );

  return (
    <motion.button
      type="button"
      className={clsx(
        baseStyles,
        BUTTON_VARIANTS[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {content}
    </motion.button>
  );
};

// Accessible Card Component
interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof CARD_VARIANTS;
  children: React.ReactNode;
  interactive?: boolean;
  ariaLabel?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  variant = 'default',
  children,
  interactive = false,
  ariaLabel,
  className,
  ...props
}) => {
  const baseStyles = 'transition-all duration-200';
  const interactiveStyles = interactive
    ? 'hover:shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2'
    : '';

  return (
    <motion.div
      className={clsx(
        baseStyles,
        CARD_VARIANTS[variant],
        interactiveStyles,
        className
      )}
      aria-label={ariaLabel}
      whileHover={interactive ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Accessible Section Component
interface AccessibleSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof SECTION_VARIANTS;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleSection: React.FC<AccessibleSectionProps> = ({
  variant = 'content',
  children,
  ariaLabel,
  ariaDescribedBy,
  className,
  ...props
}) => {
  return (
    <section
      className={clsx(
        SECTION_VARIANTS[variant],
        'py-16 px-4 sm:px-6 lg:px-8',
        className
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
};

// Accessible Link Component
interface AccessibleLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  children,
  href,
  external = false,
  ariaLabel,
  className,
  ...props
}) => {
  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-describedby': 'external-link-description',
      }
    : {};

  return (
    <motion.a
      href={href}
      className={clsx(
        'text-primary-600 hover:text-primary-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        className
      )}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.02 }}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <span id="external-link-description" className="sr-only">
          (يفتح في نافذة جديدة)
        </span>
      )}
    </motion.a>
  );
};

// Accessible Image Component
interface AccessibleImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  fallback,
  loading = 'lazy',
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError && fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      className={clsx('w-full h-auto', className)}
      onError={handleError}
      {...props}
    />
  );
};

// Skip to Content Link
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
};

// Screen Reader Only Text
export const SrOnly: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <span className="sr-only">{children}</span>;
};

export default {
  AccessibleButton,
  AccessibleCard,
  AccessibleSection,
  AccessibleLink,
  AccessibleImage,
  SkipToContent,
  SrOnly,
};
