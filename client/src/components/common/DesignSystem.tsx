import React from 'react';

// نظام تصميم مركزي موحد لجميع المكونات
export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      50: '#F8FAFC',
      100: '#F0F4F8',
      150: '#94A3B8',
      200: '#B3C5D6',
      300: '#8CA8BF',
      400: '#668BA8',
      500: '#27548A', // YInMn Blue - اللون الأساسي
      600: '#1E3F6B',
      700: '#183B4E', // Japanese Indigo
      800: '#0F2A3A',
      900: '#003362', // Dark Midnight Blue
    },
    accent: {
      50: '#FEFCF8',
      100: '#FDF8F0',
      150: '#E8D4B0',
      200: '#F5D5AD',
      300: '#F0C084',
      400: '#EBAB5B',
      500: '#DDA853', // Indian Yellow - اللون المميز
      600: '#C19A4A',
      700: '#A68B41',
      800: '#8B7C38',
      900: '#706D2F',
    },
    secondary: {
      50: '#F8FAFB',
      100: '#E6EBEE',
      150: '#9BA8B0',
      200: '#99AFBB',
      300: '#668799',
      400: '#335F77',
      500: '#183B4E', // Japanese Indigo
      600: '#0F2A3A',
      700: '#0A1F2A',
      800: '#06141A',
      900: '#003362', // Dark Midnight Blue
    },
    neutral: {
      25: '#FCFCFC',
      50: '#FAFAFA',
      75: '#F5F5F5',
      100: '#F3F3E0', // Beige - اللون المحايد
      150: '#E5E5D0',
      200: '#D4D4C0',
      300: '#C4C4B0',
      400: '#A3A390',
      500: '#737370',
      600: '#525250',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#DDA853', // Indian Yellow
      600: '#C19A4A',
      700: '#A68B41',
      800: '#8B7C38',
      900: '#706D2F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    info: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#27548A', // YInMn Blue
      600: '#1E3F6B',
      700: '#183B4E',
      800: '#0F2A3A',
      900: '#003362',
    },
  },
  fontFamily: {
    arabic:
      "'Tajawal', 'Almarai', 'Noto Sans Arabic', system-ui, -apple-system, sans-serif",
    base: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },
  radii: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

// Section Background Variants
export const SECTION_VARIANTS = {
  hero: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white',
  content: 'bg-white text-neutral-900',
  accent:
    'bg-gradient-to-br from-accent-50 via-white to-primary-50 text-neutral-900',
  neutral: 'bg-neutral-50 text-neutral-900',
  primary:
    'bg-gradient-to-br from-primary-50 via-white to-primary-100 text-neutral-900',
  dark: 'bg-neutral-900 text-white',
  light: 'bg-neutral-100 text-neutral-900',
} as const;

// Card Variants
export const CARD_VARIANTS = {
  default:
    'bg-white border border-neutral-200 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200',
  elevated:
    'bg-white border border-neutral-200 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200',
  accent:
    'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 rounded-lg hover:shadow-md transition-shadow duration-200',
  primary:
    'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg hover:shadow-md transition-shadow duration-200',
  interactive:
    'bg-white border border-neutral-200 shadow-sm rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer',
  glass:
    'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-lg',
} as const;

// Button Variants with proper contrast and improved states
export const BUTTON_VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  secondary:
    'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
  ghost:
    'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  danger:
    'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
  success:
    'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-success-500 focus:ring-offset-2',
  warning:
    'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-warning-500 focus:ring-offset-2',
  info: 'bg-info-500 text-white hover:bg-info-600 active:bg-info-700 shadow-md hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-info-500 focus:ring-offset-2',
} as const;

// Button Sizes
export const BUTTON_SIZES = {
  xs: 'text-xs px-2 py-1 rounded-md',
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-base px-4 py-2 rounded-md',
  lg: 'text-lg px-6 py-3 rounded-lg',
  xl: 'text-xl px-8 py-4 rounded-lg',
} as const;

// Input Variants
export const INPUT_VARIANTS = {
  default: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
  success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
  warning: 'border-warning-500 focus:border-warning-500 focus:ring-warning-500',
} as const;

// Alert Variants
export const ALERT_VARIANTS = {
  info: 'bg-info-50 border-info-200 text-info-800',
  success: 'bg-success-50 border-success-200 text-success-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  error: 'bg-error-50 border-error-200 text-error-800',
} as const;

// Utility function to get section classes
export const getSectionClasses = (
  variant: keyof typeof SECTION_VARIANTS = 'content'
) => {
  return SECTION_VARIANTS[variant];
};

// Utility function to get card classes
export const getCardClasses = (
  variant: keyof typeof CARD_VARIANTS = 'default'
) => {
  return CARD_VARIANTS[variant];
};

// Utility function to get button classes
export const getButtonClasses = (
  variant: keyof typeof BUTTON_VARIANTS = 'primary',
  size: keyof typeof BUTTON_SIZES = 'md'
) => {
  return `${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]}`;
};

// Utility function to get input classes
export const getInputClasses = (
  variant: keyof typeof INPUT_VARIANTS = 'default'
) => {
  return `border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${INPUT_VARIANTS[variant]}`;
};

// Utility function to get alert classes
export const getAlertClasses = (
  variant: keyof typeof ALERT_VARIANTS = 'info'
) => {
  return `border rounded-lg p-4 ${ALERT_VARIANTS[variant]}`;
};

// مثال توثيقي لمكون الزر الموحد
export const ButtonShowcase = () => (
  <div className="space-y-8 p-6 bg-neutral-50 rounded-lg">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        الأزرار الأساسية
      </h3>
      <div className="flex flex-wrap gap-4 items-center">
        <button className={getButtonClasses('primary')}>Primary</button>
        <button className={getButtonClasses('secondary')}>Secondary</button>
        <button className={getButtonClasses('accent')}>Accent</button>
        <button className={getButtonClasses('outline')}>Outline</button>
        <button className={getButtonClasses('ghost')}>Ghost</button>
        <button className={getButtonClasses('danger')}>Danger</button>
        <button className={getButtonClasses('success')}>Success</button>
        <button className={getButtonClasses('warning')}>Warning</button>
        <button className={getButtonClasses('info')}>Info</button>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">أحجام الأزرار</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <button className={getButtonClasses('primary', 'xs')}>XS</button>
        <button className={getButtonClasses('primary', 'sm')}>Small</button>
        <button className={getButtonClasses('primary', 'md')}>Medium</button>
        <button className={getButtonClasses('primary', 'lg')}>Large</button>
        <button className={getButtonClasses('primary', 'xl')}>XL</button>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">حالات الأزرار</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <button className={getButtonClasses('primary')}>Normal</button>
        <button className={getButtonClasses('primary')} disabled>
          Disabled
        </button>
        <button
          className={
            getButtonClasses('primary') + ' opacity-50 cursor-not-allowed'
          }
        >
          Loading...
        </button>
        <button className={getButtonClasses('primary') + ' w-full'}>
          Full Width
        </button>
      </div>
    </div>

    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold text-neutral-900">
        الأزرار بالعربية
      </h3>
      <div className="flex flex-wrap gap-4 items-center">
        <button className={getButtonClasses('primary')}>زر أساسي</button>
        <button className={getButtonClasses('secondary')}>زر ثانوي</button>
        <button className={getButtonClasses('accent')}>زر مميز</button>
        <button className={getButtonClasses('outline')}>زر حدود</button>
        <button className={getButtonClasses('ghost')}>زر شفاف</button>
        <button className={getButtonClasses('danger')}>زر خطير</button>
        <button className={getButtonClasses('success')}>زر نجاح</button>
        <button className={getButtonClasses('warning')}>زر تحذير</button>
        <button className={getButtonClasses('info')}>زر معلومات</button>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        أزرار مع أيقونات
      </h3>
      <div className="flex flex-wrap gap-4 items-center">
        <button className={getButtonClasses('primary') + ' flex items-center'}>
          <span className="mr-2">🔔</span>
          With Icon
        </button>
        <button className={getButtonClasses('success') + ' flex items-center'}>
          <span className="mr-2">✅</span>
          Success
        </button>
        <button className={getButtonClasses('danger') + ' flex items-center'}>
          <span className="mr-2">🗑️</span>
          Delete
        </button>
        <button className={getButtonClasses('info') + ' flex items-center'}>
          <span className="mr-2">ℹ️</span>
          Info
        </button>
      </div>
    </div>
  </div>
);

// مثال توثيقي لمكون البطاقة الموحد
export const CardShowcase = () => (
  <div className="space-y-8 p-6 bg-neutral-50 rounded-lg">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">أنواع البطاقات</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={getCardClasses('default') + ' p-6'}>
          <h4 className="font-semibold mb-2">Default Card</h4>
          <p className="text-neutral-600">بطاقة افتراضية مع تصميم بسيط</p>
        </div>
        <div className={getCardClasses('elevated') + ' p-6'}>
          <h4 className="font-semibold mb-2">Elevated Card</h4>
          <p className="text-neutral-600">بطاقة مرتفعة مع ظل أكبر</p>
        </div>
        <div className={getCardClasses('accent') + ' p-6'}>
          <h4 className="font-semibold mb-2">Accent Card</h4>
          <p className="text-neutral-600">بطاقة مميزة بلون مختلف</p>
        </div>
        <div className={getCardClasses('primary') + ' p-6'}>
          <h4 className="font-semibold mb-2">Primary Card</h4>
          <p className="text-neutral-600">بطاقة رئيسية بلون أساسي</p>
        </div>
        <div className={getCardClasses('interactive') + ' p-6'}>
          <h4 className="font-semibold mb-2">Interactive Card</h4>
          <p className="text-neutral-600">بطاقة تفاعلية مع تأثيرات حركية</p>
        </div>
        <div className={getCardClasses('glass') + ' p-6'}>
          <h4 className="font-semibold mb-2">Glass Card</h4>
          <p className="text-neutral-600">بطاقة زجاجية مع تأثير blur</p>
        </div>
      </div>
    </div>

    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold text-neutral-900">
        البطاقات بالعربية
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={getCardClasses('default') + ' p-6'}>
          <h4 className="font-semibold mb-2">بطاقة افتراضية</h4>
          <p className="text-neutral-600">بطاقة بسيطة مع تصميم نظيف</p>
        </div>
        <div className={getCardClasses('elevated') + ' p-6'}>
          <h4 className="font-semibold mb-2">بطاقة مرتفعة</h4>
          <p className="text-neutral-600">بطاقة مع ظل أكبر للتمييز</p>
        </div>
        <div className={getCardClasses('accent') + ' p-6'}>
          <h4 className="font-semibold mb-2">بطاقة مميزة</h4>
          <p className="text-neutral-600">بطاقة بلون مميز للاهتمام</p>
        </div>
      </div>
    </div>
  </div>
);

// مثال توثيقي لمكون الإدخال الموحد
import { Input as UnifiedInput } from '../ui/Input/Input';

export const InputShowcase = () => (
  <div className="space-y-8 p-6 bg-neutral-50 rounded-lg">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">أنواع الإدخال</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <UnifiedInput label="Text Input" placeholder="Type here..." />
          <UnifiedInput
            label="Input with Icon"
            icon={<span>🔍</span>}
            placeholder="Search..."
          />
          <UnifiedInput
            label="Input with Error"
            error="This field is required"
            placeholder="Error input..."
          />
          <UnifiedInput
            label="Input with Helper"
            helperText="This is a helper text"
            placeholder="Helper input..."
          />
        </div>
        <div className="space-y-4">
          <UnifiedInput
            as="select"
            label="Select Input"
            options={[
              { value: '', label: 'Choose an option' },
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
              { value: '3', label: 'Option 3' },
            ]}
          />
          <UnifiedInput
            as="textarea"
            label="Textarea"
            placeholder="Enter your message..."
            rows={4}
          />
          <UnifiedInput as="checkbox" label="I agree to the terms" />
          <UnifiedInput as="radio" label="Radio option" name="radio-group" />
        </div>
      </div>
    </div>

    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold text-neutral-900">
        الإدخال بالعربية
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <UnifiedInput label="إدخال نصي" placeholder="اكتب هنا..." />
          <UnifiedInput
            label="إدخال مع أيقونة"
            icon={<span>🔒</span>}
            placeholder="كلمة المرور..."
          />
          <UnifiedInput
            label="إدخال مع خطأ"
            error="هذا الحقل مطلوب"
            placeholder="إدخال خطأ..."
          />
          <UnifiedInput
            label="إدخال مع مساعدة"
            helperText="يرجى إدخال اسمك الكامل"
            placeholder="إدخال مساعدة..."
          />
        </div>
        <div className="space-y-4">
          <UnifiedInput
            as="select"
            label="قائمة منسدلة"
            options={[
              { value: '', label: 'اختر خياراً' },
              { value: '1', label: 'خيار 1' },
              { value: '2', label: 'خيار 2' },
              { value: '3', label: 'خيار 3' },
            ]}
          />
          <UnifiedInput
            as="textarea"
            label="منطقة نص"
            placeholder="اكتب رسالتك هنا..."
            rows={4}
          />
          <UnifiedInput as="checkbox" label="أوافق على الشروط" />
          <UnifiedInput as="radio" label="خيار راديو" name="radio-group-rtl" />
        </div>
      </div>
    </div>
  </div>
);

// مثال توثيقي للنوافذ المنبثقة
import { Modal as UnifiedModal } from '../ui/Modal/Modal';
import { useState } from 'react';

export const ModalShowcase = () => {
  const [open, setOpen] = useState(false);
  const [openRtl, setOpenRtl] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-neutral-50 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          النوافذ المنبثقة
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            className={getButtonClasses('primary')}
            onClick={() => setOpen(true)}
          >
            Open Modal
          </button>
          <button
            className={getButtonClasses('secondary')}
            onClick={() => setOpenRtl(true)}
          >
            فتح نافذة منبثقة
          </button>
        </div>
      </div>

      <UnifiedModal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
        description="This is a description for the modal."
        actions={
          <div className="flex gap-3">
            <button
              className={getButtonClasses('ghost', 'sm')}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className={getButtonClasses('primary', 'sm')}
              onClick={() => setOpen(false)}
            >
              Confirm
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>Modal content goes here. You can put any React node here.</p>
          <p>This is an example of a modal with proper styling and actions.</p>
        </div>
      </UnifiedModal>

      <UnifiedModal
        open={openRtl}
        onClose={() => setOpenRtl(false)}
        title="عنوان النافذة"
        description="وصف مختصر للنافذة المنبثقة."
        dir="rtl"
        actions={
          <div className="flex gap-3">
            <button
              className={getButtonClasses('ghost', 'sm')}
              onClick={() => setOpenRtl(false)}
            >
              إلغاء
            </button>
            <button
              className={getButtonClasses('primary', 'sm')}
              onClick={() => setOpenRtl(false)}
            >
              تأكيد
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>محتوى النافذة المنبثقة هنا. يمكنك وضع أي عنصر React.</p>
          <p>هذا مثال على نافذة منبثقة مع تصميم مناسب وأزرار.</p>
        </div>
      </UnifiedModal>
    </div>
  );
};

// مثال توثيقي للتنبيهات
import Alert from './Alert';
import { useToast, ToastProvider } from './Toast';

export const AlertShowcase = () => (
  <div className="space-y-6 p-6 bg-neutral-50 rounded-lg">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        أنواع التنبيهات
      </h3>
      <div className="space-y-4 max-w-lg">
        <Alert type="info" title="Info Alert">
          This is an info alert with important information.
        </Alert>
        <Alert type="success" title="Success Alert">
          This is a success alert indicating a successful operation.
        </Alert>
        <Alert type="warning" title="Warning Alert">
          This is a warning alert to draw attention to important information.
        </Alert>
        <Alert type="error" title="Error Alert">
          This is an error alert indicating something went wrong.
        </Alert>
      </div>
    </div>

    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold text-neutral-900">
        التنبيهات بالعربية
      </h3>
      <div className="space-y-4 max-w-lg">
        <Alert type="info" title="تنبيه معلوماتي">
          هذا تنبيه معلوماتي يحتوي على معلومات مهمة.
        </Alert>
        <Alert type="success" title="تنبيه نجاح">
          هذا تنبيه نجاح يشير إلى عملية ناجحة.
        </Alert>
        <Alert type="warning" title="تنبيه تحذير">
          هذا تنبيه تحذير لجذب الانتباه إلى معلومات مهمة.
        </Alert>
        <Alert type="error" title="تنبيه خطأ">
          هذا تنبيه خطأ يشير إلى أن شيئاً ما حدث خطأ.
        </Alert>
      </div>
    </div>
  </div>
);

export const ToastShowcase = () => {
  const { addToast } = useToast();

  return (
    <div className="space-y-6 p-6 bg-neutral-50 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">رسائل Toast</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className={getButtonClasses('success', 'sm')}
            onClick={() =>
              addToast({
                type: 'success',
                title: 'Success',
                message: 'Operation completed successfully',
              })
            }
          >
            Success Toast
          </button>
          <button
            className={getButtonClasses('error', 'sm')}
            onClick={() =>
              addToast({
                type: 'error',
                title: 'Error',
                message: 'Something went wrong',
              })
            }
          >
            Error Toast
          </button>
          <button
            className={getButtonClasses('warning', 'sm')}
            onClick={() =>
              addToast({
                type: 'warning',
                title: 'Warning',
                message: 'Please be careful',
              })
            }
          >
            Warning Toast
          </button>
          <button
            className={getButtonClasses('info', 'sm')}
            onClick={() =>
              addToast({
                type: 'info',
                title: 'Info',
                message: 'This is an informational message',
              })
            }
          >
            Info Toast
          </button>
        </div>
      </div>

      <div className="space-y-4" dir="rtl">
        <h3 className="text-lg font-semibold text-neutral-900">
          رسائل Toast بالعربية
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            className={getButtonClasses('success', 'sm')}
            onClick={() =>
              addToast({
                type: 'success',
                title: 'نجاح',
                message: 'تمت العملية بنجاح',
                dir: 'rtl',
              })
            }
          >
            نجاح
          </button>
          <button
            className={getButtonClasses('error', 'sm')}
            onClick={() =>
              addToast({
                type: 'error',
                title: 'خطأ',
                message: 'حدث خطأ ما',
                dir: 'rtl',
              })
            }
          >
            خطأ
          </button>
          <button
            className={getButtonClasses('warning', 'sm')}
            onClick={() =>
              addToast({
                type: 'warning',
                title: 'تحذير',
                message: 'يرجى الانتباه',
                dir: 'rtl',
              })
            }
          >
            تحذير
          </button>
          <button
            className={getButtonClasses('info', 'sm')}
            onClick={() =>
              addToast({
                type: 'info',
                title: 'معلومة',
                message: 'هذه رسالة معلوماتية',
                dir: 'rtl',
              })
            }
          >
            معلومة
          </button>
        </div>
      </div>
    </div>
  );
};

export default DESIGN_SYSTEM;
