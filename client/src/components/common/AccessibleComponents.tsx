import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { getButtonClasses, getCardClasses } from './DesignSystem';

// Accessible Button Component
interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
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
        getButtonClasses(variant, size),
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
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
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
  return (
    <motion.div
      className={clsx(
        getCardClasses(variant),
        interactive && 'cursor-pointer hover:shadow-lg',
        className
      )}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Accessible Section Component
interface AccessibleSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
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
      className={clsx('py-16', className)}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
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
  const linkProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': ariaLabel || `${children} (يفتح في نافذة جديدة)`,
      }
    : { 'aria-label': ariaLabel };

  return (
    <a
      href={href}
      className={clsx(
        'text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline transition-colors duration-200',
        className
      )}
      {...linkProps}
      {...props}
    >
      {children}
      {external && <span className="sr-only"> (يفتح في نافذة جديدة)</span>}
    </a>
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
      className={clsx('max-w-full h-auto', className)}
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
