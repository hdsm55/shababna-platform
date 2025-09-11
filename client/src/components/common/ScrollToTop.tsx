import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // تمرير فوري للأعلى عند تغيير الصفحة
    window.scrollTo(0, 0);

    // إزالة أي scroll restoration من المتصفح
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
