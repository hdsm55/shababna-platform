import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isRTL } = useLanguageStore();

  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">{children || <Outlet />}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
