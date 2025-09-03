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

      // تحسين عرض الخطوط
      const fontFaces = [
        {
          family: 'Inter',
          weight: '400',
          style: 'normal',
          src: 'url("/fonts/Inter-Regular.woff2") format("woff2")',
        },
        {
          family: 'Inter',
          weight: '600',
          style: 'normal',
          src: 'url("/fonts/Inter-SemiBold.woff2") format("woff2")',
        },
        {
          family: 'Inter',
          weight: '700',
          style: 'normal',
          src: 'url("/fonts/Inter-Bold.woff2") format("woff2")',
        },
        {
          family: 'Noto Sans Arabic',
          weight: '400',
          style: 'normal',
          src: 'url("/fonts/NotoSansArabic-Regular.woff2") format("woff2")',
        },
        {
          family: 'Noto Sans Arabic',
          weight: '600',
          style: 'normal',
          src: 'url("/fonts/NotoSansArabic-SemiBold.woff2") format("woff2")',
        },
        {
          family: 'Noto Sans Arabic',
          weight: '700',
          style: 'normal',
          src: 'url("/fonts/NotoSansArabic-Bold.woff2") format("woff2")',
        },
      ];

      // تطبيق Font Display Swap
      fontFaces.forEach((fontFace) => {
        const font = new FontFace(fontFace.family, fontFace.src, {
          weight: fontFace.weight,
          style: fontFace.style,
          display: 'swap',
        });

        font
          .load()
          .then((loadedFont) => {
            document.fonts.add(loadedFont);
          })
          .catch((error) => {
            console.warn(`Failed to load font ${fontFace.family}:`, error);
          });
      });
    }

    // تحسين تحميل الخطوط المخصصة
    const preloadFonts = () => {
      const fontLinks = [
        {
          href: '/fonts/Inter-Regular.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          href: '/fonts/Inter-SemiBold.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          href: '/fonts/Inter-Bold.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          href: '/fonts/NotoSansArabic-Regular.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          href: '/fonts/NotoSansArabic-SemiBold.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          href: '/fonts/NotoSansArabic-Bold.woff2',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
      ];

      fontLinks.forEach((font) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font.href;
        link.as = 'font';
        link.type = font.type;
        link.crossOrigin = font.crossOrigin;
        document.head.appendChild(link);
      });
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
