import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../ui/theme';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  const { isRTL } = useLanguageStore();

  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'ar' : 'en';
  }, [isRTL]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col bg-[${
        theme.colors.background
      }] font-[${
        isRTL ? theme.fontFamily.arabic : theme.fontFamily.latin
      }] text-[${theme.colors.textPrimary}] ${className}`}
      style={{
        fontFamily: isRTL ? theme.fontFamily.arabic : theme.fontFamily.latin,
        background: theme.colors.background,
        color: theme.colors.textPrimary,
      }}
    >
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
