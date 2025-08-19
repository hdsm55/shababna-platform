import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import InstantLoader from '../common/InstantLoader';
import PageTransitionHandler from '../common/PageTransitionHandler';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isRTL } = useLanguageStore();
  const location = useLocation();
  const [showFooter, setShowFooter] = React.useState(true);
  const [contentLoaded, setContentLoaded] = React.useState(true);
  const [pageTransitioning, setPageTransitioning] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  // معالجة تغيير الصفحة
  const handlePageChange = () => {
    setPageTransitioning(true);
    setShowFooter(false);
    setContentLoaded(false);
  };

  // معالجة تحميل الصفحة
  const handlePageLoad = () => {
    setPageTransitioning(false);
    setContentLoaded(true);

    // تأخير قصير لإظهار الفوتر بعد تحميل المحتوى
    setTimeout(() => {
      setShowFooter(true);
    }, 100);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <PageTransitionHandler
            onPageChange={handlePageChange}
            onPageLoad={handlePageLoad}
          >
            <InstantLoader
              onContentLoad={() => {
                if (!pageTransitioning) {
                  setContentLoaded(true);
                  setShowFooter(true);
                }
              }}
            >
              {children || <Outlet />}
            </InstantLoader>
          </PageTransitionHandler>
        </div>
      </main>
      {showFooter && contentLoaded && <Footer />}
    </div>
  );
};

export default Layout;
