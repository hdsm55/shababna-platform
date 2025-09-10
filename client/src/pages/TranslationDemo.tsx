import React from 'react';
import { Helmet } from 'react-helmet-async';
import TranslationExample from '../components/examples/TranslationExample';
import { useTranslation } from 'react-i18next';

/**
 * صفحة عرض مثال شامل لنظام الترجمة
 * توضح كيفية استخدام جميع مفاتيح الترجمة
 */
const TranslationDemo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('home.meta.title')}</title>
        <meta name="description" content={t('home.meta.description')} />
        <meta name="keywords" content={t('home.meta.keywords')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌍 نظام الترجمة المتكامل
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              مثال شامل يوضح كيفية استخدام نظام الترجمة في منصة شبابنا مع دعم
              كامل للغات العربية والإنجليزية والتركية
            </p>
          </div>

          <TranslationExample />

          {/* Instructions */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📋 تعليمات استخدام نظام الترجمة
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🔧 كيفية إضافة نص جديد:
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>
                      1. أضف المفتاح في ملف{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        ar.json
                      </code>
                    </li>
                    <li>
                      2. أضف نفس المفتاح في{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        en.json
                      </code>
                    </li>
                    <li>
                      3. أضف نفس المفتاح في{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        tr.json
                      </code>
                    </li>
                    <li>
                      4. استخدم{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        t('key')
                      </code>{' '}
                      في المكون
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    🎯 أفضل الممارسات:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• استخدم مفاتيح واضحة وموحدة</li>
                    <li>• لا تترك نصوص مباشرة في الكود</li>
                    <li>• اختبر الترجمة في جميع اللغات</li>
                    <li>• استخدم fallback values عند الحاجة</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💡 مثال على الاستخدام:
                </h4>
                <pre className="text-sm text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
                  {`// في المكون
const { t } = useTranslation();

// استخدام المفتاح
<h1>{t('home.hero.title')}</h1>

// مع fallback
<p>{t('home.hero.subtitle', 'النص الافتراضي')}</p>

// مع متغيرات
<span>{t('events.daysRemaining', { count: 5 })}</span>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationDemo;
