import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div
      className="page-container flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
                  <img
            src="/images/logo.jpg"
            alt="شبابنا"
            className="h-20 w-20 object-cover rounded-2xl mb-6 shadow-lg"
          />
        <div className="text-[7rem] font-extrabold text-primary-600 mb-2 select-none">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('notFound.title', 'الصفحة غير موجودة')}
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          {t(
            'notFound.subtitle',
            'عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.'
          )}
        </p>
        <Button
          size="lg"
          variant="primary"
          onClick={() => navigate('/')}
          className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {t('notFound.cta', 'العودة للرئيسية')}
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
