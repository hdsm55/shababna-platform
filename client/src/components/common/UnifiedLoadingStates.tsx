import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  Loader2,
  Sparkles,
  Zap,
  Heart,
  Star,
  Globe,
  Users,
  Target,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Unified Loading States - حالات التحميل الموحدة
 * مكونات موحدة لجميع حالات التحميل في التطبيق
 */

// أنواع التحميل
export type LoadingType = 'page' | 'section' | 'button' | 'inline' | 'overlay';

// أحجام التحميل
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// أنماط التحميل
export type LoadingVariant =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'bars'
  | 'brand'
  | 'minimal';

// ألوان التحميل
export type LoadingColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'white';

interface BaseLoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: LoadingColor;
  text?: string;
  className?: string;
}

// مكون التحميل الأساسي
const BaseLoader: React.FC<BaseLoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  className,
}) => {
  const { t } = useTranslation();

  // أحجام موحدة
  const sizeMap = {
    xs: { spinner: 'w-3 h-3', text: 'text-xs', icon: 'w-4 h-4' },
    sm: { spinner: 'w-4 h-4', text: 'text-sm', icon: 'w-5 h-5' },
    md: { spinner: 'w-6 h-6', text: 'text-sm', icon: 'w-6 h-6' },
    lg: { spinner: 'w-8 h-8', text: 'text-base', icon: 'w-8 h-8' },
    xl: { spinner: 'w-12 h-12', text: 'text-lg', icon: 'w-10 h-10' },
  };

  // ألوان موحدة
  const colorMap = {
    primary: 'text-primary-600 border-primary-600',
    secondary: 'text-secondary-600 border-secondary-600',
    accent: 'text-accent-600 border-accent-600',
    neutral: 'text-neutral-600 border-neutral-600',
    white: 'text-white border-white',
  };

  const currentSize = sizeMap[size];
  const currentColor = colorMap[color];

  // مكونات التحميل المختلفة
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={currentSize} color={currentColor} />;
      case 'pulse':
        return <PulseLoader size={currentSize} color={currentColor} />;
      case 'bars':
        return <BarsLoader size={currentSize} color={currentColor} />;
      case 'brand':
        return <BrandLoader size={currentSize} />;
      case 'minimal':
        return <MinimalLoader size={currentSize} color={currentColor} />;
      default:
        return <SpinnerLoader size={currentSize} color={currentColor} />;
    }
  };

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {renderLoader()}
      {text && (
        <span className={clsx(currentSize.text, 'font-medium', currentColor)}>
          {text}
        </span>
      )}
    </div>
  );
};

// دوار التحميل الأساسي
const SpinnerLoader: React.FC<{ size: any; color: string }> = ({
  size,
  color,
}) => (
  <motion.div
    className={clsx(
      'rounded-full border-2 border-t-transparent animate-spin',
      size.spinner,
      color
    )}
    role="status"
    aria-label="Loading"
  />
);

// تحميل النقاط
const DotsLoader: React.FC<{ size: any; color: string }> = ({
  size,
  color,
}) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={clsx('rounded-full', color)}
        style={{
          width: size.spinner.replace('w-', '').replace('h-', ''),
          height: size.spinner.replace('w-', '').replace('h-', ''),
        }}
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// تحميل النبض
const PulseLoader: React.FC<{ size: any; color: string }> = ({
  size,
  color,
}) => (
  <motion.div
    className={clsx('rounded-full', size.spinner, color)}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

// تحميل الأشرطة
const BarsLoader: React.FC<{ size: any; color: string }> = ({
  size,
  color,
}) => (
  <div className="flex items-end gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={clsx('rounded-sm', color)}
        style={{
          width: size.spinner.replace('w-', '').replace('h-', ''),
          height: size.spinner.replace('w-', '').replace('h-', ''),
        }}
        animate={{
          height: [
            size.spinner.replace('w-', '').replace('h-', ''),
            'h-1',
            size.spinner.replace('w-', '').replace('h-', ''),
          ],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// تحميل العلامة التجارية
const BrandLoader: React.FC<{ size: any }> = ({ size }) => (
  <motion.div
    className={clsx(
      'relative rounded-full bg-gradient-to-br from-primary-500 to-secondary-500',
      size.spinner
    )}
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  >
    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
      <motion.div
        className="text-primary-600 font-bold text-xs"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        شبابنا
      </motion.div>
    </div>
  </motion.div>
);

// تحميل بسيط
const MinimalLoader: React.FC<{ size: any; color: string }> = ({
  size,
  color,
}) => <Loader2 className={clsx('animate-spin', size.icon, color)} />;

// مكون تحميل الصفحة
interface PageLoaderProps extends BaseLoadingProps {
  message?: string;
  fullScreen?: boolean;
  showTips?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message,
  fullScreen = false,
  showTips = false,
  size = 'lg',
  variant = 'brand',
  color = 'primary',
  className,
}) => {
  const { t } = useTranslation();

  const tips = [
    {
      text: t(
        'loading.tip1',
        '💡 نصيحة: يمكنك تصفح الفعاليات والبرامج أثناء التحميل'
      ),
      icon: Sparkles,
    },
    {
      text: t('loading.tip2', '🌟 اكتشف برامجنا التطويرية المميزة'),
      icon: Star,
    },
    {
      text: t('loading.tip3', '📱 تابعنا على وسائل التواصل الاجتماعي'),
      icon: Globe,
    },
    {
      text: t('loading.tip4', '🎯 انضم إلى مجتمع شبابنا العالمي'),
      icon: Users,
    },
  ];

  const content = (
    <div className={clsx('flex flex-col items-center gap-6', className)}>
      <BaseLoader
        size={size}
        variant={variant}
        color={color}
        text={message || t('common.loading', 'جاري التحميل...')}
      />

      {showTips && (
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-neutral-600"
          >
            {tips[Math.floor(Math.random() * tips.length)].text}
          </motion.div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// مكون تحميل القسم
export const SectionLoader: React.FC<BaseLoadingProps> = (props) => (
  <div className="flex items-center justify-center py-12">
    <BaseLoader {...props} size={props.size || 'md'} />
  </div>
);

// مكون تحميل الزر
export const ButtonLoader: React.FC<BaseLoadingProps> = (props) => (
  <BaseLoader
    {...props}
    size={props.size || 'sm'}
    variant={props.variant || 'minimal'}
  />
);

// مكون تحميل مضمن
export const InlineLoader: React.FC<BaseLoadingProps> = (props) => (
  <BaseLoader
    {...props}
    size={props.size || 'xs'}
    variant={props.variant || 'minimal'}
  />
);

// مكون تحميل تراكب
export const OverlayLoader: React.FC<PageLoaderProps> = (props) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 shadow-xl">
      <PageLoader {...props} fullScreen={false} />
    </div>
  </div>
);

// مكون تحميل الخادم المجاني
export const BackendIdleLoader: React.FC<BaseLoadingProps> = (props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4">
      <BaseLoader
        {...props}
        size={props.size || 'md'}
        variant={props.variant || 'pulse'}
        text={
          props.text ||
          t('loading.backendIdle', 'الخادم المجاني يستيقظ من النوم...')
        }
      />
      <div className="text-sm text-neutral-600 text-center">
        {t(
          'loading.backendIdleMessage',
          'يرجى الانتظار قليلاً بينما يستيقظ الخادم'
        )}
      </div>
    </div>
  );
};

// تصدير جميع المكونات
export { useUnifiedLoading } from '../../hooks/useUnifiedLoading';

export {
  BaseLoader,
  SpinnerLoader,
  DotsLoader,
  PulseLoader,
  BarsLoader,
  BrandLoader,
  MinimalLoader,
};
