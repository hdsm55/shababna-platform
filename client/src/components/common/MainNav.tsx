import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const MainNav: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const currentLang = i18n.language || 'ar';
  const navRef = React.useRef<HTMLUListElement>(null);
  const langBtnRef = React.useRef<HTMLButtonElement>(null);
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  // يجب تعريف navLinks و languages هنا بعد useTranslation
  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/events', label: t('nav.events') },
    { to: '/programs', label: t('nav.programs') },
    { to: '/blogs', label: t('nav.blogs', 'المدونة') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/join-us', label: t('nav.joinUs') },
  ];
  const languages = [
    { code: 'ar', label: t('nav.lang_ar', 'العربية'), flag: '🇸🇦' },
    { code: 'en', label: t('nav.lang_en', 'English'), flag: '🇬🇧' },
    { code: 'tr', label: t('nav.lang_tr', 'Türkçe'), flag: '🇹🇷' },
  ];

  // دعم التنقل عبر الأسهم في القائمة الرئيسية
  const handleNavKeyDown = (e: React.KeyboardEvent) => {
    if (!navRef.current) return;
    const items = Array.from(navRef.current.querySelectorAll('a'));
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      let nextIdx = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (nextIdx < 0) nextIdx = items.length - 1;
      if (nextIdx >= items.length) nextIdx = 0;
      (items[nextIdx] as HTMLElement).focus();
    }
  };

  // دعم إغلاق قائمة اللغة عند الضغط خارجها أو Esc
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        open &&
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node) &&
        !langBtnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  // دعم التنقل بلوحة المفاتيح في قائمة اللغة
  const handleLangMenuKeyDown = (e: React.KeyboardEvent) => {
    if (!langMenuRef.current) return;
    const items = Array.from(langMenuRef.current.querySelectorAll('button'));
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      let nextIdx = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      if (nextIdx < 0) nextIdx = items.length - 1;
      if (nextIdx >= items.length) nextIdx = 0;
      (items[nextIdx] as HTMLElement).focus();
    }
    if (e.key === 'Tab') setOpen(false);
  };

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
      aria-label="القائمة الرئيسية"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary-700 tracking-tight"
          tabIndex={0}
        >
          <img
            src="/images/logo.png"
            alt="شبابنا - الشعار"
            className="h-10 w-auto object-contain"
            style={{ maxHeight: 40 }}
          />
        </Link>
        <ul
          className="flex gap-2 md:gap-6 items-center"
          ref={navRef}
          role="menubar"
          aria-label="روابط التنقل"
          onKeyDown={handleNavKeyDown}
        >
          {navLinks.map((link) => (
            <li key={link.to} role="none">
              <Link
                to={link.to}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-600',
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                )}
                role="menuitem"
                aria-current={
                  location.pathname === link.to ? 'page' : undefined
                }
                tabIndex={0}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Language Switcher */}
        <div className="relative ms-4">
          <button
            ref={langBtnRef}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary-600"
            aria-label="تغيير اللغة"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls="lang-menu"
          >
            <span>{languages.find((l) => l.code === currentLang)?.flag}</span>
            <span>{languages.find((l) => l.code === currentLang)?.label}</span>
          </button>
          {open && (
            <div
              id="lang-menu"
              ref={langMenuRef}
              className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleLangMenuKeyDown}
            >
              {languages.map((lang, idx) => (
                <button
                  key={lang.code}
                  onClick={() => handleChangeLang(lang.code)}
                  className={clsx(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-primary-600',
                    currentLang === lang.code &&
                      'bg-primary-50 text-primary-700 font-bold'
                  )}
                  role="option"
                  aria-selected={currentLang === lang.code}
                  tabIndex={0}
                  autoFocus={idx === 0}
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
