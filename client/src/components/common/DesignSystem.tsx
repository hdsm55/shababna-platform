import React from 'react';

// نظام تصميم مركزي موحد لجميع المكونات
export const DESIGN_SYSTEM = {
  colors: {
    primary: '#27548A',
    accent: '#DDA853',
    secondary: '#183B4E',
    neutral: '#F7F7F7',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E42',
    info: '#3B82F6',
  },
  fontFamily: {
    arabic: "'Tajawal', 'Almarai', system-ui, -apple-system, sans-serif",
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
} as const;

// Card Variants
export const CARD_VARIANTS = {
  default: 'bg-white border border-neutral-200 shadow-sm rounded-lg',
  elevated: 'bg-white border border-neutral-200 shadow-md rounded-lg',
  accent:
    'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 rounded-lg',
  primary:
    'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg',
} as const;

// Button Variants with proper contrast
export const BUTTON_VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
  accent: 'bg-accent-500 text-white hover:bg-accent-600',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
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
  variant: keyof typeof BUTTON_VARIANTS = 'primary'
) => {
  return BUTTON_VARIANTS[variant];
};

// مثال توثيقي لمكون الزر الموحد
export const ButtonShowcase = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-4 items-center">
      <button className={getButtonClasses('primary') + ' px-4 py-2'}>
        Primary
      </button>
      <button className={getButtonClasses('secondary') + ' px-4 py-2'}>
        Secondary
      </button>
      <button className={getButtonClasses('outline') + ' px-4 py-2'}>
        Outline
      </button>
      <button className={getButtonClasses('ghost') + ' px-4 py-2'}>
        Ghost
      </button>
      <button className={getButtonClasses('primary') + ' px-4 py-2'} disabled>
        Disabled
      </button>
      <button className={getButtonClasses('primary') + ' px-4 py-2 w-full'}>
        Full Width
      </button>
    </div>
    <div className="flex flex-wrap gap-4 items-center" dir="rtl">
      <button className={getButtonClasses('primary') + ' px-4 py-2'}>
        زر أساسي
      </button>
      <button className={getButtonClasses('secondary') + ' px-4 py-2'}>
        زر ثانوي
      </button>
      <button className={getButtonClasses('outline') + ' px-4 py-2'}>
        زر حدود
      </button>
      <button className={getButtonClasses('ghost') + ' px-4 py-2'}>
        زر شفاف
      </button>
      <button className={getButtonClasses('primary') + ' px-4 py-2'} disabled>
        معطل
      </button>
      <button className={getButtonClasses('primary') + ' px-4 py-2 w-full'}>
        زر بعرض كامل
      </button>
    </div>
    <div className="flex flex-wrap gap-4 items-center">
      <button
        className={getButtonClasses('primary') + ' px-4 py-2 flex items-center'}
      >
        <span className="mr-2">🔔</span> With Icon
      </button>
      <button
        className={getButtonClasses('primary') + ' px-4 py-2 flex items-center'}
        disabled
      >
        <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading
      </button>
    </div>
  </div>
);

// مثال توثيقي لمكون البطاقة الموحد
export const CardShowcase = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-4 items-start">
      <div className={getCardClasses('default') + ' p-6 w-64'}>
        Default Card
      </div>
      <div className={getCardClasses('accent') + ' p-6 w-64'}>Accent Card</div>
      <div className={getCardClasses('elevated') + ' p-6 w-64'}>
        Elevated Card
      </div>
      <div className={getCardClasses('primary') + ' p-6 w-64'}>
        Primary Card
      </div>
      <div
        className={
          getCardClasses('default') +
          ' p-6 w-64 transition-all duration-200 hover:shadow-lg hover:-translate-y-1'
        }
      >
        Hoverable Card
      </div>
    </div>
    <div className="flex flex-wrap gap-4 items-start" dir="rtl">
      <div className={getCardClasses('default') + ' p-6 w-64'}>
        بطاقة افتراضية
      </div>
      <div className={getCardClasses('accent') + ' p-6 w-64'}>بطاقة مميزة</div>
      <div className={getCardClasses('elevated') + ' p-6 w-64'}>
        بطاقة مرتفعة
      </div>
      <div className={getCardClasses('primary') + ' p-6 w-64'}>
        بطاقة رئيسية
      </div>
      <div
        className={
          getCardClasses('default') +
          ' p-6 w-64 transition-all duration-200 hover:shadow-lg hover:-translate-y-1'
        }
      >
        بطاقة تفاعلية
      </div>
    </div>
    <div className="flex flex-wrap gap-4 items-start">
      <div className={getCardClasses('default') + ' p-4 w-48'}>Padding sm</div>
      <div className={getCardClasses('default') + ' p-6 w-48'}>Padding md</div>
      <div className={getCardClasses('default') + ' p-8 w-48'}>Padding lg</div>
    </div>
  </div>
);

// مثال توثيقي لمكون الإدخال الموحد
import { Input as UnifiedInput } from '../ui/Input/Input';

export const InputShowcase = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 max-w-md">
      <UnifiedInput label="Input" placeholder="Type here..." />
      <UnifiedInput
        label="Input with Icon"
        icon={<span>🔍</span>}
        placeholder="بحث..."
      />
      <UnifiedInput
        label="Input Error"
        error="خطأ في الإدخال"
        placeholder="خطأ..."
      />
      <UnifiedInput
        label="Helper Text"
        helperText="معلومة مساعدة"
        placeholder="مساعدة..."
      />
      <UnifiedInput label="Full Width" fullWidth placeholder="عرض كامل..." />
    </div>
    <div className="flex flex-col gap-4 max-w-md">
      <UnifiedInput
        as="select"
        label="Select"
        options={[
          { value: '', label: 'اختر' },
          { value: '1', label: 'خيار 1' },
          { value: '2', label: 'خيار 2' },
        ]}
      />
      <UnifiedInput as="checkbox" label="موافق على الشروط" />
    </div>
    <div className="flex flex-col gap-4 max-w-md" dir="rtl">
      <UnifiedInput label="إدخال عربي" placeholder="اكتب هنا..." />
      <UnifiedInput
        label="إدخال مع أيقونة"
        icon={<span>🔒</span>}
        placeholder="كلمة المرور..."
      />
      <UnifiedInput label="خطأ" error="هذا الحقل مطلوب" placeholder="خطأ..." />
      <UnifiedInput
        label="مساعدة"
        helperText="يرجى إدخال اسمك الكامل"
        placeholder="اسمك..."
      />
      <UnifiedInput
        as="select"
        label="قائمة منسدلة"
        options={[
          { value: '', label: 'اختر' },
          { value: 'a', label: 'خيار أ' },
          { value: 'b', label: 'خيار ب' },
        ]}
      />
      <UnifiedInput as="checkbox" label="أوافق على الشروط" />
    </div>
  </div>
);

import { Modal as UnifiedModal } from '../ui/Modal/Modal';
import { useState } from 'react';

export const ModalShowcase = () => {
  const [open, setOpen] = useState(false);
  const [openRtl, setOpenRtl] = useState(false);
  return (
    <div className="space-y-6">
      <button
        className="bg-primary-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>
      <UnifiedModal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
        description="This is a description for the modal."
        actions={
          <>
            <button
              className="bg-neutral-200 px-3 py-1 rounded"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-primary-600 text-white px-3 py-1 rounded"
              onClick={() => setOpen(false)}
            >
              Confirm
            </button>
          </>
        }
      >
        <div>Modal content goes here. You can put any React node here.</div>
      </UnifiedModal>
      <button
        className="bg-primary-600 text-white px-4 py-2 rounded"
        dir="rtl"
        onClick={() => setOpenRtl(true)}
      >
        فتح نافذة منبثقة
      </button>
      <UnifiedModal
        open={openRtl}
        onClose={() => setOpenRtl(false)}
        title="عنوان النافذة"
        description="وصف مختصر للنافذة المنبثقة."
        dir="rtl"
        actions={
          <>
            <button
              className="bg-neutral-200 px-3 py-1 rounded"
              onClick={() => setOpenRtl(false)}
            >
              إلغاء
            </button>
            <button
              className="bg-primary-600 text-white px-3 py-1 rounded"
              onClick={() => setOpenRtl(false)}
            >
              تأكيد
            </button>
          </>
        }
      >
        <div>محتوى النافذة المنبثقة هنا. يمكنك وضع أي عنصر React.</div>
      </UnifiedModal>
    </div>
  );
};

import Alert from './Alert';
import { useToast, ToastProvider } from './Toast';

export const AlertShowcase = () => (
  <div className="space-y-4 max-w-lg">
    <Alert type="info" title="Info Alert">
      This is an info alert.
    </Alert>
    <Alert type="success" title="Success Alert">
      This is a success alert.
    </Alert>
    <Alert type="warning" title="Warning Alert">
      This is a warning alert.
    </Alert>
    <Alert type="error" title="Error Alert">
      This is an error alert.
    </Alert>
    <Alert type="info" title="تنبيه معلوماتي" dir="rtl">
      هذا تنبيه معلوماتي باللغة العربية.
    </Alert>
    <Alert type="success" title="نجاح" dir="rtl">
      تمت العملية بنجاح.
    </Alert>
  </div>
);

export const ToastShowcase = () => {
  const { addToast } = useToast();
  return (
    <div className="space-x-2">
      <button
        className="bg-green-600 text-white px-3 py-1 rounded"
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
        className="bg-red-600 text-white px-3 py-1 rounded"
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
        className="bg-yellow-500 text-white px-3 py-1 rounded"
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
        className="bg-blue-600 text-white px-3 py-1 rounded"
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
  );
};

export default DESIGN_SYSTEM;
