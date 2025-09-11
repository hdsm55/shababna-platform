import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // تمرير فوري للأعلى عند تغيير الصفحة
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // إزالة أي scroll restoration من المتصفح
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // التأكد من التمرير للأعلى حتى لو كان هناك تأخير في التحميل
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
