import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { Outlet } from 'react-router-dom';

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
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // التأكد من التمرير للأعلى عند تغيير الصفحة
  React.useEffect(() => {
    // تمرير فوري للأعلى عند تغيير الصفحة
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`fix-layout ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <ScrollToTop />
      <Header />
      <main className="fix-content">
        <div className="page-container">{children || <Outlet />}</div>
      </main>
      {showFooter && (
        <div className="fix-footer">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
