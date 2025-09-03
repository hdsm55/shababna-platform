import React, { useState } from 'react';
import SmartPageLoader from './SmartPageLoader';

const PageLoaderDemo: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderConfig, setLoaderConfig] = useState({
    variant: 'default' as const,
    size: 'medium' as const,
    theme: 'light' as const,
    showProgress: true,
    message: 'جاري تحميل الصفحة...',
  });

  const variants = [
    { key: 'default', label: 'افتراضي' },
    { key: 'minimal', label: 'بسيط' },
    { key: 'skeleton', label: 'هيكلي' },
    { key: 'wave', label: 'موجي' },
    { key: 'pulse', label: 'نبضي' },
    { key: 'dots', label: 'نقاط' },
  ];

  const sizes = [
    { key: 'small', label: 'صغير' },
    { key: 'medium', label: 'متوسط' },
    { key: 'large', label: 'كبير' },
  ];

  const themes = [
    { key: 'light', label: 'فاتح' },
    { key: 'dark', label: 'داكن' },
    { key: 'brand', label: 'العلامة التجارية' },
  ];

  const messages = [
    'جاري تحميل الصفحة...',
    'جاري تحميل البيانات...',
    'جاري معالجة المحتوى...',
    'يرجى الانتظار...',
    'جاري التحميل...',
  ];

  const handleShowLoader = () => {
    setShowLoader(true);
    // إخفاء التحميل بعد 3 ثواني
    setTimeout(() => setShowLoader(false), 3000);
  };

  const updateConfig = (key: string, value: any) => {
    setLoaderConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-container bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            عرض مكونات التحميل
          </h1>
          <p className="text-xl text-gray-600">
            اختر الإعدادات المفضلة لديك وشاهد النتيجة
          </p>
        </div>

        {/* إعدادات التحميل */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            إعدادات التحميل
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* نوع التحميل */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع التحميل
              </label>
              <select
                value={loaderConfig.variant}
                onChange={(e) => updateConfig('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {variants.map((variant) => (
                  <option key={variant.key} value={variant.key}>
                    {variant.label}
                  </option>
                ))}
              </select>
            </div>

            {/* الحجم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحجم
              </label>
              <select
                value={loaderConfig.size}
                onChange={(e) => updateConfig('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sizes.map((size) => (
                  <option key={size.key} value={size.key}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* الثيم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الثيم
              </label>
              <select
                value={loaderConfig.theme}
                onChange={(e) => updateConfig('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {themes.map((theme) => (
                  <option key={theme.key} value={theme.key}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            {/* الرسالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرسالة
              </label>
              <select
                value={loaderConfig.message}
                onChange={(e) => updateConfig('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {messages.map((message, index) => (
                  <option key={index} value={message}>
                    {message}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* خيارات إضافية */}
          <div className="mt-6 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={loaderConfig.showProgress}
                onChange={(e) => updateConfig('showProgress', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">إظهار شريط التقدم</span>
            </label>
          </div>

          {/* زر عرض التحميل */}
          <div className="mt-6 text-center">
            <button
              onClick={handleShowLoader}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              عرض التحميل
            </button>
          </div>
        </div>

        {/* معاينة التحميل */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            معاينة التحميل
          </h2>

          <div className="text-center">
            <div className="inline-block p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600 mb-4">
                اضغط على "عرض التحميل" لرؤية المكون في العمل
              </p>

              {/* عرض مصغر للتحميل */}
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            💡 نصائح للاستخدام
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>
              • استخدم <strong>افتراضي</strong> للصفحات التي تحتاج وقت تحميل
              طويل
            </li>
            <li>
              • استخدم <strong>بسيط</strong> للتحميل السريع
            </li>
            <li>
              • استخدم <strong>هيكلي</strong> لإظهار هيكل الصفحة
            </li>
            <li>
              • استخدم <strong>موجي</strong> للتحميل المتدرج
            </li>
            <li>
              • استخدم <strong>نبضي</strong> للتحميل النشط
            </li>
            <li>
              • استخدم <strong>نقاط</strong> للتحميل البسيط
            </li>
          </ul>
        </div>
      </div>

      {/* عرض التحميل */}
      {showLoader && (
        <SmartPageLoader
          message={loaderConfig.message}
          showProgress={loaderConfig.showProgress}
          variant={loaderConfig.variant}
          size={loaderConfig.size}
          theme={loaderConfig.theme}
        />
      )}
    </div>
  );
};

export default PageLoaderDemo;
