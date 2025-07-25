import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
  const isRTL = i18n.dir() === 'rtl';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError('');
      setIsLoading(true);

      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful registration for demo
      const mockUser = {
        id: 2,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        role: 'member',
        avatar: `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`,
      };

      const mockToken = 'mock-jwt-token-register-12345';

      login(mockUser, mockToken);
      localStorage.setItem('token', mockToken);

      navigate('/');
    } catch (error: any) {
      setRegisterError(
        t(
          'auth.register.error',
          'فشل في إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        )
      );
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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

      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 to-accent-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <span className="text-white font-bold text-3xl">ش</span>
                </div>
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

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
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
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
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
                </div>
              </div>
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
            <Card className="p-8 shadow-2xl rounded-2xl border-0">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">ش</span>
                </div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  {t('auth.register.title', 'إنشاء حساب')}
                </h1>
                <p className="text-gray-600">
                  {t('auth.register.subtitle', 'أنشئ حسابك وانضم إلى مجتمعنا')}
                </p>
              </div>

              {/* Error Alert */}
              {registerError && (
                <Alert type="error" className="mb-6">
                  {registerError}
                </Alert>
              )}

              {/* Register Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                        })}
                        className="pl-10"
                        placeholder={t(
                          'auth.register.firstName.placeholder',
                          'الاسم الأول'
                        )}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
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
                        })}
                        className="pl-10"
                        placeholder={t(
                          'auth.register.lastName.placeholder',
                          'اسم العائلة'
                        )}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
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
                      className="pl-10"
                      placeholder={t(
                        'auth.register.email.placeholder',
                        'أدخل بريدك الإلكتروني'
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
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
                      className="pl-10 pr-12"
                      placeholder={t(
                        'auth.register.password.placeholder',
                        'أدخل كلمة المرور'
                      )}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
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
                      className="pl-10 pr-12"
                      placeholder={t(
                        'auth.register.confirmPassword.placeholder',
                        'تأكيد كلمة المرور'
                      )}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
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
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('auth.register.terms.conditions', 'الشروط والأحكام')}
                    </Link>{' '}
                    {t('auth.register.terms.and', 'و')}{' '}
                    <Link
                      to="/privacy"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('auth.register.terms.privacy', 'سياسة الخصوصية')}
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      {t('auth.register.submit', 'إنشاء الحساب')}
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6">
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
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  {t('auth.register.haveAccount', 'لديك حساب بالفعل؟')}{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    {t('auth.register.login', 'سجل الدخول')}
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
