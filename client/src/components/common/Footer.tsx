import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer
      className="w-full bg-gray-50 border-t border-gray-100 py-6 mt-12"
      dir="auto"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="/" className="hover:text-primary-600 transition">
            {t('nav.home')}
          </a>
          <a href="/events" className="hover:text-primary-600 transition">
            {t('nav.events')}
          </a>
          <a href="/programs" className="hover:text-primary-600 transition">
            {t('nav.programs')}
          </a>
          <a href="/contact" className="hover:text-primary-600 transition">
            {t('nav.contact')}
          </a>
          <a href="/blogs" className="hover:text-primary-600 transition">
            {t('nav.blogs', 'المدونة')}
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
