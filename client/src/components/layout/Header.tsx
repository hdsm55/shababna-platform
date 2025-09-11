import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isRTL, setLanguage } = useLanguageStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  const handleLanguageChange = (lang: 'ar' | 'en' | 'tr') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setIsLangMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'events', path: '/events' },
    { key: 'programs', path: '/programs' },
    { key: 'blogs', path: '/blogs' },
    { key: 'joinUs', path: '/join-us' },
    { key: 'contact', path: '/contact' },
  ];

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse group"
          >
            <img
              src="/images/logo.svg"
              alt="شبابنا - الشعار"
              className="h-12 w-12 object-contain logo"
              style={{ backgroundColor: 'transparent' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                {t(`nav.${item.key}`)}
                <span
                  className={`nav-underline ${
                    location.pathname === item.path
                      ? 'nav-underline-active'
                      : ''
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-neutral-600 hover:text-primary-600 transition-colors duration-300 rounded-lg hover:bg-neutral-100 flex items-center space-x-1 rtl:space-x-reverse"
              >
                <Globe className="w-4 h-4" />
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    isLangMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute ${
                      isRTL ? 'left-0' : 'right-0'
                    } mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 backdrop-blur-sm`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() =>
                          handleLanguageChange(lang.code as 'ar' | 'en' | 'tr')
                        }
                        className={`w-full px-4 py-2 text-left rtl:text-right flex items-center space-x-3 rtl:space-x-reverse hover:bg-neutral-50 transition-colors duration-300 ${
                          language === lang.code
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-neutral-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {user?.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-neutral-100"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-neutral-100 px-3 py-2 rounded-lg hover:bg-neutral-200 transition-colors duration-300">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {user?.first_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-600 hover:text-error-600 transition-colors duration-300 rounded-lg hover:bg-error-50"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors duration-300 rounded-lg hover:bg-neutral-100"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-200 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 text-base font-medium transition-colors duration-300 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
