import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
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
    { key: 'events', path: '/events' },
    { key: 'programs', path: '/programs' },
    { key: 'joinUs', path: '/join-us' },
    { key: 'contact', path: '/contact' },
  ];

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Shababna Global
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-700'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as 'ar' | 'en' | 'tr')}
                        className={`w-full px-4 py-2 text-left rtl:text-right flex items-center space-x-3 rtl:space-x-reverse hover:bg-gray-50 ${
                          language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
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
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {t('nav.dashboard')}
                  </Link>
                )}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="md:hidden border-t border-gray-200 py-4"
            >
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
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