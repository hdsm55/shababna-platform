import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, Heart, Star, Users, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuthWelcome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'مجتمع نشط',
      description: 'انضم إلى مجتمع من الشباب المتحمسين للتغيير',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'فرص التطوير',
      description: 'احصل على فرص تدريبية وتطويرية متنوعة',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'التطوع والعطاء',
      description: 'شارك في الأنشطة التطوعية وخدمة المجتمع',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'الإنجاز والتميز',
      description: 'احصل على شهادات تقدير ومكافآت معنوية',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <img
              src="/images/logo.svg"
              alt="شبابنا"
              className="h-20 w-20 object-contain mx-auto mb-6 logo"
              style={{ backgroundColor: 'transparent' }}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
              مرحباً بك في شبابنا
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              منصة الشباب الأولى للتطوع والتطوير والانخراط في خدمة المجتمع
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              انضم إلى مجتمعنا اليوم
            </h2>
            <p className="text-gray-600 mb-8">
              ابدأ رحلتك معنا وكن جزءاً من التغيير الإيجابي
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
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
                className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              بالانضمام إلى شبابنا، فإنك توافق على{' '}
              <a href="#" className="text-blue-600 hover:underline">
                شروط الاستخدام
              </a>{' '}
              و{' '}
              <a href="#" className="text-blue-600 hover:underline">
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
