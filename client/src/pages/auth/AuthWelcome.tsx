import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  LogIn,
  Heart,
  Star,
  Users,
  Lightbulb,
  Home,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuthWelcome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'مجتمع نشط',
      description: 'انضم إلى مجتمع من الشباب المتحمسين للتغيير',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'فرص التطوير',
      description: 'احصل على فرص تدريبية وتطويرية متنوعة',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'التطوع والعطاء',
      description: 'شارك في الأنشطة التطوعية وخدمة المجتمع',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'الإنجاز والتميز',
      description: 'احصل على شهادات تقدير ومكافآت معنوية',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* زر العودة للصفحة الرئيسية */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <img
            src="/images/logo-shababna.png"
            alt="شبابنا"
            className="h-16 w-16 object-contain mx-auto mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            مرحباً بك في شبابنا
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            منصة الشباب الأولى للتطوع والتطوير والانخراط في خدمة المجتمع
          </p>
        </motion.div>

        {/* Features Grid - مبسطة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white border border-neutral-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-primary-600 mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action - مبسط */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white border border-neutral-200 rounded-xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              انضم إلى مجتمعنا اليوم
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              ابدأ رحلتك معنا وكن جزءاً من التغيير الإيجابي
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                إنشاء حساب جديد
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full text-primary-600 py-2 px-6 text-sm font-medium hover:text-primary-700 transition-colors"
              >
                تسجيل الدخول
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              بالانضمام إلى شبابنا، فإنك توافق على{' '}
              <a href="#" className="text-primary-600 hover:underline">
                شروط الاستخدام
              </a>{' '}
              و{' '}
              <a href="#" className="text-primary-600 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthWelcome;
