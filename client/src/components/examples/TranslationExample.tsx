import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../store/languageStore';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * مثال شامل لاستخدام نظام الترجمة
 * يوضح كيفية استخدام مفاتيح الترجمة وتبديل اللغات
 */
const TranslationExample: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  // قائمة اللغات المتاحة
  const languages = [
    { code: 'ar', name: t('nav.lang_ar'), flag: '🇸🇦' },
    { code: 'en', name: t('nav.lang_en'), flag: '🇺🇸' },
    { code: 'tr', name: t('nav.lang_tr'), flag: '🇹🇷' },
  ];

  // دالة تبديل اللغة
  const handleLanguageChange = (lang: 'ar' | 'en' | 'tr') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setIsLangMenuOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg text-gray-600">{t('home.hero.subtitle')}</p>
      </div>

      {/* Language Switcher */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{languages.find((l) => l.code === language)?.flag}</span>
            <span>{languages.find((l) => l.code === language)?.name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() =>
                      handleLanguageChange(lang.code as 'ar' | 'en' | 'tr')
                    }
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      language === lang.code
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Examples */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Navigation Example */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('nav.home')}</h2>
          <nav className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>{t('nav.about')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>{t('nav.events')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>{t('nav.programs')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>{t('nav.blogs')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
              <span>{t('nav.contact')}</span>
            </div>
          </nav>
        </div>

        {/* Events Example */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('events.title')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t('events.stats.available')}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {t('events.status.active')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t('events.stats.upcoming')}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {t('events.status.upcoming')}
              </span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              {t('events.actions.register')}
            </button>
          </div>
        </div>

        {/* Programs Example */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('programs.title')}</h2>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              {t('programs.subtitle')}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {t('programs.categories.education')}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {t('programs.categories.health')}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {t('programs.categories.technology')}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Example */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('contact.title')}</h2>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">{t('contact.subtitle')}</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {t('contact.info.address')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {t('contact.info.email')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {t('contact.info.phone')}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              {t('contact.form.submit')}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">
            {t('home.stats.membersNumber')}
          </div>
          <div className="text-sm text-gray-600">{t('home.stats.members')}</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {t('home.stats.eventsNumber')}
          </div>
          <div className="text-sm text-gray-600">{t('home.stats.events')}</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {t('home.stats.countriesNumber')}
          </div>
          <div className="text-sm text-gray-600">
            {t('home.stats.countries')}
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {t('home.stats.programsNumber')}
          </div>
          <div className="text-sm text-gray-600">
            {t('home.stats.programs')}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </div>
  );
};

export default TranslationExample;
