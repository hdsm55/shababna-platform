import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Heart,
  Star,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';
import PasswordMatchIndicator from '../../components/common/PasswordMatchIndicator';
import EmailValidator from '../../components/common/EmailValidator';
import ProgressBar from '../../components/common/ProgressBar';
import { registerApi } from '../../services/api';
import SEO from '../../components/common/SEO';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const isRTL = i18n.dir() === 'rtl';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const firstName = watch('first_name');
  const lastName = watch('last_name');
  const email = watch('email');

  // حساب تقدم النموذج
  useEffect(() => {
    let completed = 0;
    if (firstName) completed += 20;
    if (lastName) completed += 20;
    if (email) completed += 20;
    if (password) completed += 20;
    if (confirmPassword && password === confirmPassword) completed += 20;

    setProgress(completed);
  }, [firstName, lastName, email, password, confirmPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    console.log('🔍 بيانات النموذج المرسلة:', data);
    try {
      setRegisterError('');
      setIsLoading(true);
      setFormStep(1);

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // استدعاء API الحقيقي
      const response = await registerApi(data);

      if (response.success) {
        setIsSuccess(true);
        setFormStep(2);

        // تأخير قصير لإظهار رسالة النجاح
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // تسجيل الدخول تلقائياً
        // ملاحظة: لإنشاء مستخدم مدير للاختبار، غيّر role إلى 'admin'
        const mockUser = {
          id: 2,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: 'user' as const,
          avatar: `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`,
        };

        const mockToken = 'mock-jwt-token-register-12345';

        login(mockUser, mockToken);
        localStorage.setItem('token', mockToken);

        // توجيه المستخدمين العاديين إلى الصفحة الرئيسية
        navigate('/');
      } else {
        setRegisterError(response.message || 'فشل في إنشاء الحساب');
        setFormStep(0);
      }
    } catch (error: any) {
      setRegisterError(
        t(
          'auth.register.error',
          'فشل في إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        )
      );
      setFormStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // تأثيرات الحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const floatingElements = [
    { delay: 0, duration: 3, color: 'bg-accent-300' },
    { delay: 1, duration: 4, color: 'bg-primary-300' },
    { delay: 2, duration: 3.5, color: 'bg-secondary-300' },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 ${element.color} rounded-full opacity-60`}
            style={{
              left: `${20 + index * 30}%`,
              top: `${30 + index * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <SEO
        title={t(
          'auth.register.seo.title',
          'إنشاء حساب - منصة شبابنا العالمية'
        )}
        description={t(
          'auth.register.seo.description',
          'أنشئ حسابك في منصة شبابنا العالمية وانضم إلى مجتمعنا'
        )}
        type="website"
      />

      <div className="flex min-h-screen relative z-10">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-accent-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          {/* تأثيرات خلفية متحركة */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-24 h-24 bg-primary-400/20 rounded-full blur-lg"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="mb-8">
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">
                  {t('auth.register.hero.title', 'انضم إلى مجتمعنا')}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  {t(
                    'auth.register.hero.subtitle',
                    'أنشئ حسابك وساهم في صناعة التغيير الإيجابي مع شبابنا'
                  )}
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('auth.register.hero.feature1.title', 'انضم مجاناً')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.register.hero.feature1.description',
                        'إنشاء الحساب مجاني وسريع'
                      )}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('auth.register.hero.feature2.title', 'بيئة آمنة')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.register.hero.feature2.description',
                        'بيئة محمية وآمنة للتفاعل'
                      )}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('auth.register.hero.feature3.title', 'مجتمع عالمي')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.register.hero.feature3.description',
                        'تواصل مع شباب من أنحاء العالم'
                      )}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 shadow-2xl rounded-2xl border-0 backdrop-blur-sm bg-white/95">
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
                  العودة للصفحة الرئيسية
                </button>
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  {t('auth.register.title', 'إنشاء حساب')}
                </h1>
                <p className="text-gray-600">
                  {t('auth.register.subtitle', 'أنشئ حسابك وانضم إلى مجتمعنا')}
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <ProgressBar
                  progress={progress}
                  label="تقدم النموذج"
                  color="accent"
                />
              </motion.div>

              {/* Success Message */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-6"
                  >
                    <Alert type="success" className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t(
                        'auth.register.success',
                        'تم إنشاء الحساب بنجاح! جاري توجيهك إلى الصفحة الرئيسية...'
                      )}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Alert */}
              <AnimatePresence>
                {registerError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <Alert type="error" className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {registerError}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Register Form */}
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('auth.register.firstName.label', 'الاسم الأول')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="first_name"
                        type="text"
                        {...register('first_name', {
                          required: t(
                            'auth.register.firstName.required',
                            'الاسم الأول مطلوب'
                          ),
                          minLength: {
                            value: 2,
                            message: t(
                              'auth.register.firstName.minLength',
                              'الاسم الأول يجب أن يكون حرفين على الأقل'
                            ),
                          },
                        })}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                        placeholder={t(
                          'auth.register.firstName.placeholder',
                          'أدخل اسمك الأول'
                        )}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.first_name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-600 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.first_name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('auth.register.lastName.label', 'اسم العائلة')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="last_name"
                        type="text"
                        {...register('last_name', {
                          required: t(
                            'auth.register.lastName.required',
                            'اسم العائلة مطلوب'
                          ),
                          minLength: {
                            value: 2,
                            message: t(
                              'auth.register.lastName.minLength',
                              'اسم العائلة يجب أن يكون حرفين على الأقل'
                            ),
                          },
                        })}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                        placeholder={t(
                          'auth.register.lastName.placeholder',
                          'أدخل اسم العائلة'
                        )}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.last_name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-600 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.last_name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.register.email.label', 'البريد الإلكتروني')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: t(
                          'auth.register.email.required',
                          'البريد الإلكتروني مطلوب'
                        ),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t(
                            'auth.register.email.invalid',
                            'عنوان البريد الإلكتروني غير صحيح'
                          ),
                        },
                      })}
                      className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                      placeholder={t(
                        'auth.register.email.placeholder',
                        'أدخل بريدك الإلكتروني'
                      )}
                    />
                  </div>

                  {/* Email Validator */}
                  <EmailValidator email={email || ''} />

                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-600 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.register.password.label', 'كلمة المرور')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: t(
                          'auth.register.password.required',
                          'كلمة المرور مطلوبة'
                        ),
                        minLength: {
                          value: 6,
                          message: t(
                            'auth.register.password.minLength',
                            'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                          ),
                        },
                      })}
                      className="pl-10 pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                      placeholder={t(
                        'auth.register.password.placeholder',
                        'أدخل كلمة المرور'
                      )}
                    />
                    <motion.button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={
                        showPassword
                          ? t(
                              'auth.register.password.hide',
                              'إخفاء كلمة المرور'
                            )
                          : t(
                              'auth.register.password.show',
                              'إظهار كلمة المرور'
                            )
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={password || ''} />

                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-600 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t(
                      'auth.register.confirmPassword.label',
                      'تأكيد كلمة المرور'
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: t(
                          'auth.register.confirmPassword.required',
                          'تأكيد كلمة المرور مطلوب'
                        ),
                        validate: (value) =>
                          value === password ||
                          t(
                            'auth.register.confirmPassword.mismatch',
                            'كلمتا المرور غير متطابقتين'
                          ),
                      })}
                      className="pl-10 pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                      placeholder={t(
                        'auth.register.confirmPassword.placeholder',
                        'تأكيد كلمة المرور'
                      )}
                    />
                    <motion.button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={
                        showConfirmPassword
                          ? t(
                              'auth.register.confirmPassword.hide',
                              'إخفاء كلمة المرور'
                            )
                          : t(
                              'auth.register.confirmPassword.show',
                              'إظهار كلمة المرور'
                            )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>

                  {/* Password Match Indicator */}
                  <PasswordMatchIndicator
                    password={password || ''}
                    confirmPassword={confirmPassword || ''}
                  />

                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-600 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                    required
                  />
                  <label htmlFor="terms" className="mr-2 text-sm text-gray-600">
                    {t('auth.register.terms.text', 'أوافق على')}{' '}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      {t('auth.register.terms.conditions', 'الشروط والأحكام')}
                    </Link>{' '}
                    {t('auth.register.terms.and', 'و')}{' '}
                    <Link
                      to="/privacy"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      {t('auth.register.terms.privacy', 'سياسة الخصوصية')}
                    </Link>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold relative overflow-hidden"
                    disabled={isSubmitting || isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <LoadingSpinner size="sm" />
                          <span className="mr-2">
                            {t('auth.register.loading', 'جاري إنشاء الحساب...')}
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="submit"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          {t('auth.register.submit', 'إنشاء الحساب')}
                          <ArrowRight className="w-5 h-5 mr-2" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="my-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {t('auth.register.or', 'أو')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  {t('auth.register.haveAccount', 'لديك حساب بالفعل؟')}{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                  >
                    {t('auth.register.login', 'سجل الدخول')}
                  </Link>
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
