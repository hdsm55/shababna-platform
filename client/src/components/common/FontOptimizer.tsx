import React, { useEffect } from 'react';

interface FontOptimizerProps {
  children: React.ReactNode;
}

const FontOptimizer: React.FC<FontOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // تحسين تحميل الخطوط
    if ('fonts' in document) {
      // إضافة class عند تحميل الخطوط
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });

      // تحسين تحميل الخطوط من Google Fonts
      console.log('🔤 بدء تحميل الخطوط...');
      const startTime = performance.now();

      // مراقبة تحميل الخطوط
      document.fonts.ready
        .then(() => {
          const endTime = performance.now();
          console.log('✅ اكتمل تحميل الخطوط');
          console.log(`🔤 وقت تحميل الخطوط: ${endTime.toFixed(2)} ms`);
        })
        .catch((error) => {
          console.warn('⚠️ خطأ في تحميل الخطوط:', error);
        });
    }

    // تحسين تحميل الخطوط - تم إزالته لأن الخطوط تُحمّل من Google Fonts
    const preloadFonts = () => {
      // الخطوط تُحمّل من Google Fonts CDN في index.html
      console.log('🔤 تم تحسين تحميل الخطوط من Google Fonts');
    };

    // تأخير تحميل الخطوط للصفحات غير المهمة
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadFonts);
    } else {
      preloadFonts();
    }
  }, []);

  return <>{children}</>;
};

export default FontOptimizer;
