import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import InstantLoader from '../common/InstantLoader';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isRTL } = useLanguageStore();
  const location = useLocation();
  const [showFooter, setShowFooter] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // إخفاء الفوتر عند تغيير الصفحة ثم إظهاره بعد تحميل المحتوى
  React.useEffect(() => {
    setShowFooter(false);

    // تأخير قصير لإظهار الفوتر بعد تحميل المحتوى
    const timer = setTimeout(() => {
      setShowFooter(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <InstantLoader>{children || <Outlet />}</InstantLoader>
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
