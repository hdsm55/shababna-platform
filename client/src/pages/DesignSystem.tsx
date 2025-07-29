import React from 'react';
import {
  ButtonShowcase,
  CardShowcase,
  InputShowcase,
  ModalShowcase,
  AlertShowcase,
  ToastShowcase,
} from '../components/common/DesignSystem';
import { ToastProvider } from '../components/common/Toast';

const DesignSystemPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            نظام التصميم الموحد
          </h1>
          <p className="text-lg text-neutral-600">
            نظام تصميم شامل ومتناسق لجميع مكونات منصة شبابنا العالمية
          </p>
        </div>

        <div className="space-y-12">
          {/* الألوان */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              نظام الألوان
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary-600 rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-neutral-500">#27548A</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-secondary-600 rounded-lg"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-neutral-500">#183B4E</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-accent-500 rounded-lg"></div>
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-neutral-500">#DDA853</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-success-600 rounded-lg"></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs text-neutral-500">#22C55E</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-warning-600 rounded-lg"></div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-xs text-neutral-500">#F59E42</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-error-600 rounded-lg"></div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-xs text-neutral-500">#EF4444</p>
              </div>
            </div>
          </section>

          {/* الأزرار */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              الأزرار
            </h2>
            <ButtonShowcase />
          </section>

          {/* البطاقات */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              البطاقات
            </h2>
            <CardShowcase />
          </section>

          {/* حقول الإدخال */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              حقول الإدخال
            </h2>
            <InputShowcase />
          </section>

          {/* النوافذ المنبثقة */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              النوافذ المنبثقة
            </h2>
            <ModalShowcase />
          </section>

          {/* التنبيهات */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              التنبيهات
            </h2>
            <AlertShowcase />
          </section>

          {/* رسائل Toast */}
          <ToastProvider>
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
                رسائل Toast
              </h2>
              <ToastShowcase />
            </section>
          </ToastProvider>

          {/* Typography */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              الخطوط
            </h2>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900">
                  عنوان رئيسي H1
                </h1>
                <p className="text-sm text-neutral-500">text-4xl font-bold</p>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-neutral-900">
                  عنوان فرعي H2
                </h2>
                <p className="text-sm text-neutral-500">
                  text-3xl font-semibold
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-medium text-neutral-900">
                  عنوان قسم H3
                </h3>
                <p className="text-sm text-neutral-500">text-2xl font-medium</p>
              </div>
              <div>
                <h4 className="text-xl font-medium text-neutral-900">
                  عنوان فرعي H4
                </h4>
                <p className="text-sm text-neutral-500">text-xl font-medium</p>
              </div>
              <div>
                <p className="text-lg text-neutral-700">نص كبير للقراءة</p>
                <p className="text-sm text-neutral-500">text-lg</p>
              </div>
              <div>
                <p className="text-base text-neutral-700">نص عادي للقراءة</p>
                <p className="text-sm text-neutral-500">text-base</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">نص صغير للتفاصيل</p>
                <p className="text-sm text-neutral-500">text-sm</p>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              المسافات
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm">xs: 0.25rem (4px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm">sm: 0.5rem (8px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm">md: 1rem (16px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm">lg: 1.5rem (24px)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-4 bg-primary-600 rounded"></div>
                <span className="text-sm">xl: 2rem (32px)</span>
              </div>
            </div>
          </section>

          {/* Shadows */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              الظلال
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <p className="font-medium">Shadow SM</p>
                <p className="text-sm text-neutral-500">shadow-sm</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <p className="font-medium">Shadow MD</p>
                <p className="text-sm text-neutral-500">shadow-md</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <p className="font-medium">Shadow LG</p>
                <p className="text-sm text-neutral-500">shadow-lg</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-xl">
                <p className="font-medium">Shadow XL</p>
                <p className="text-sm text-neutral-500">shadow-xl</p>
              </div>
            </div>
          </section>

          {/* Border Radius */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              نصف قطر الحدود
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-primary-100 rounded-none">
                <p className="text-sm font-medium">None</p>
                <p className="text-xs text-neutral-500">rounded-none</p>
              </div>
              <div className="p-4 bg-primary-100 rounded-sm">
                <p className="text-sm font-medium">Small</p>
                <p className="text-xs text-neutral-500">rounded-sm</p>
              </div>
              <div className="p-4 bg-primary-100 rounded-md">
                <p className="text-sm font-medium">Medium</p>
                <p className="text-xs text-neutral-500">rounded-md</p>
              </div>
              <div className="p-4 bg-primary-100 rounded-lg">
                <p className="text-sm font-medium">Large</p>
                <p className="text-xs text-neutral-500">rounded-lg</p>
              </div>
              <div className="p-4 bg-primary-100 rounded-full">
                <p className="text-sm font-medium">Full</p>
                <p className="text-xs text-neutral-500">rounded-full</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPage;
