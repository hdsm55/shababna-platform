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
  CheckCircle,
  ArrowRight,
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const isRTL = i18n.dir() === 'rtl';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // حساب قوة كلمة المرور
  React.useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 25) return 'ضعيفة';
    if (strength <= 50) return 'متوسطة';
    if (strength <= 75) return 'جيدة';
    return 'قوية';
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError('');
      setIsLoading(true);

      // استدعاء API الحقيقي
      const response = await registerApi({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        const { user, token } = response.data;

        // تحويل البيانات لتتطابق مع النوع المطلوب
        const authUser = {
          id: user.id,
          first_name: user.first_name || user.firstName,
          last_name: user.last_name || user.lastName,
          email: user.email,
          role: user.role || 'member',
          avatar:
            user.avatar ||
            `${user.first_name?.charAt(0)}${user.last_name?.charAt(0)}`,
        };

        login(authUser, token);
        localStorage.setItem('token', token);

        navigate('/');
      } else {
        setRegisterError(response.message || 'فشل في إنشاء الحساب');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      setRegisterError(
        error.response?.data?.message ||
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
          'أنشئ حسابك في منصة شبابنا العالمية'
        )}
        type="website"
      />

      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
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
                  {t('auth.register.hero.title', 'انضم إلى مجتمع شبابنا')}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  {t(
                    'auth.register.hero.subtitle',
                    'سجل الآن واستفد من جميع المميزات والخدمات'
                  )}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('auth.register.hero.feature1.title', 'حساب مجاني')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.register.hero.feature1.description',
                        'أنشئ حسابك مجاناً واستفد من جميع الخدمات'
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
                      {t('auth.register.hero.feature2.title', 'حماية كاملة')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.register.hero.feature2.description',
                        'بياناتك محمية ومؤمنة بالكامل'
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
            <Card className="p-8 shadow-2xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-2xl">ش</span>
                </div>
                <h1 className="text-3xl font-bold text-primary-900 mb-3">
                  {t('auth.register.title', 'إنشاء حساب')}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
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
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      {t('auth.register.firstName.label', 'الاسم الأول')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="first_name"
                        type="text"
                        autoComplete="given-name"
                        {...register('first_name', {
                          required: t(
                            'auth.register.firstName.required',
                            'الاسم الأول مطلوب'
                          ),
                        })}
                        className="pl-10 py-3 border-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder={t(
                          'auth.register.firstName.placeholder',
                          'الاسم الأول'
                        )}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-600 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      {t('auth.register.lastName.label', 'اسم العائلة')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="last_name"
                        type="text"
                        autoComplete="family-name"
                        {...register('last_name', {
                          required: t(
                            'auth.register.lastName.required',
                            'اسم العائلة مطلوب'
                          ),
                        })}
                        className="pl-10 py-3 border-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        placeholder={t(
                          'auth.register.lastName.placeholder',
                          'اسم العائلة'
                        )}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-red-600 text-sm mt-2 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    {t('auth.register.email.label', 'البريد الإلكتروني')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
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
                      className="pl-10 py-3 border-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder={t(
                        'auth.register.email.placeholder',
                        'أدخل بريدك الإلكتروني'
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    {t('auth.register.password.label', 'كلمة المرور')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('password', {
                        required: t(
                          'auth.register.password.required',
                          'كلمة المرور مطلوبة'
                        ),
                        minLength: {
                          value: 8,
                          message: t(
                            'auth.register.password.minLength',
                            'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
                          ),
                        },
                      })}
                      className="pl-10 pr-12 py-3 border-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder={t(
                        'auth.register.password.placeholder',
                        'أدخل كلمة المرور'
                      )}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-medium">
                          قوة كلمة المرور:
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength <= 25
                              ? 'text-red-600'
                              : passwordStrength <= 50
                              ? 'text-orange-600'
                              : passwordStrength <= 75
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                            passwordStrength
                          )}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-3"
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
                      autoComplete="new-password"
                      {...register('confirmPassword', {
                        required: t(
                          'auth.register.confirmPassword.required',
                          'تأكيد كلمة المرور مطلوب'
                        ),
                        validate: (value) =>
                          value === password ||
                          t(
                            'auth.register.confirmPassword.match',
                            'كلمة المرور غير متطابقة'
                          ),
                      })}
                      className="pl-10 pr-12 py-3 border-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder={t(
                        'auth.register.confirmPassword.placeholder',
                        'أعد إدخال كلمة المرور'
                      )}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 transition-all duration-200 mt-1"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="mr-2 text-sm text-gray-600 leading-relaxed"
                  >
                    {t('auth.register.terms.text', 'أوافق على')}{' '}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
                    >
                      {t('auth.register.terms.conditions', 'الشروط والأحكام')}
                    </Link>{' '}
                    {t('auth.register.terms.and', 'و')}{' '}
                    <Link
                      to="/privacy"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
                    >
                      {t('auth.register.terms.privacy', 'سياسة الخصوصية')}
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="py-4 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                  disabled={isSubmitting || isLoading}
                  icon={
                    isLoading ? undefined : <UserPlus className="w-5 h-5" />
                  }
                  iconPosition="left"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" color="white" />
                      <span className="mr-2">
                        {t('auth.register.loading', 'جاري إنشاء الحساب...')}
                      </span>
                    </div>
                  ) : (
                    t('auth.register.submit', 'إنشاء حساب')
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      {t('auth.register.or', 'أو')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {t('auth.register.haveAccount', 'لديك حساب بالفعل؟')}{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-bold transition-colors duration-200 hover:underline"
                  >
                    {t('auth.register.login', 'سجل دخولك')}
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
