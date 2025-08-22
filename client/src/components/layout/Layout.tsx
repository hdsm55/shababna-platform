import React from 'react';
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
  const [showFooter, setShowFooter] = React.useState(false);
  const [contentLoaded, setContentLoaded] = React.useState(false);
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
    // تأخير إظهار الفوتر لضمان ظهور المحتوى أولاً
    setTimeout(() => {
      setShowFooter(true);
    }, 500);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      <Header />
      <main className="flex-1 flex flex-col min-h-[60vh]">
        <div className="flex-1">
          <PageTransitionHandler
            onPageChange={handlePageChange}
            onPageLoad={handlePageLoad}
          >
            <InstantLoader
              onContentLoad={() => {
                if (!pageTransitioning) {
                  setContentLoaded(true);
                  // تأخير إظهار الفوتر لضمان ظهور المحتوى أولاً
                  setTimeout(() => {
                    setShowFooter(true);
                  }, 500);
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
