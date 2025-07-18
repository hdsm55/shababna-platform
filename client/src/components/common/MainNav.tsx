import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/events', label: 'الفعاليات' },
  { to: '/programs', label: 'البرامج' },
  { to: '/contact', label: 'تواصل معنا' },
  { to: '/blogs', label: 'المدونة' },
  { to: '/join-us', label: 'تسجيل عضوية' },
];

const languages = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

const MainNav: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const currentLang = i18n.language || 'ar';

  const handleChangeLang = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <nav
      className="w-full bg-white border-b border-gray-100 shadow-sm"
      dir="auto"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold text-primary-700 tracking-tight"
        >
          شبابنا
        </Link>
        <ul className="flex gap-2 md:gap-6 items-center">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition',
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Language Switcher */}
        <div className="relative ms-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
            aria-label="تغيير اللغة"
          >
            <span>{languages.find((l) => l.code === currentLang)?.flag}</span>
            <span>{languages.find((l) => l.code === currentLang)?.label}</span>
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLang(lang.code)}
                  className={clsx(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition',
                    currentLang === lang.code &&
                      'bg-primary-50 text-primary-700 font-bold'
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
