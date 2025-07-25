import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { loginApi } from '../../services/api';
import SEO from '../../components/common/SEO';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = i18n.dir() === 'rtl';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: 'onTouched' });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      setIsLoading(true);

      // استدعاء API الحقيقي
      const response = await loginApi(data.email, data.password);

      if (response.success) {
        const { user, token } = response.data;

        // تحويل البيانات لتتطابق مع النوع المطلوب
        const authUser = {
          id: user.id,
          first_name: user.first_name || user.firstName,
          last_name: user.last_name || user.lastName,
          email: user.email,
          role: user.role,
          avatar:
            user.avatar ||
            `${user.first_name?.charAt(0)}${user.last_name?.charAt(0)}`,
        };

        login(authUser, token);
        localStorage.setItem('token', token);

        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setLoginError(response.message || 'فشل في تسجيل الدخول');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(
        error.response?.data?.message ||
          t(
            'auth.login.error',
            'فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
          )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (formErrors: typeof errors) => {
    if (formErrors.email) {
      emailRef.current?.focus();
    } else if (formErrors.password) {
      passwordRef.current?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('auth.login.seo.title', 'تسجيل الدخول - منصة شبابنا العالمية')}
        description={t(
          'auth.login.seo.description',
          'سجل الدخول إلى حسابك في منصة شبابنا العالمية'
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
                  {t('auth.login.hero.title', 'مرحباً بك في منصة شبابنا')}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  {t(
                    'auth.login.hero.subtitle',
                    'انضم إلى مجتمعنا النشط وساهم في صناعة التغيير الإيجابي'
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
                      {t('auth.login.hero.feature1.title', 'مجتمع نشط')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.login.hero.feature1.description',
                        'انضم إلى آلاف الشباب النشطين'
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
                      {t('auth.login.hero.feature2.title', 'بيئة آمنة')}
                    </h3>
                    <p className="text-white/80">
                      {t(
                        'auth.login.hero.feature2.description',
                        'بيئة محمية وآمنة للتفاعل'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">ش</span>
                </div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  {t('auth.login.title', 'تسجيل الدخول')}
                </h1>
                <p className="text-gray-600">
                  {t('auth.login.subtitle', 'سجل الدخول إلى حسابك')}
                </p>
              </div>

              {/* Error Alert */}
              {loginError && (
                <Alert type="error" className="mb-6">
                  {loginError}
                </Alert>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="space-y-6"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.login.email.label', 'البريد الإلكتروني')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email', {
                        required: t(
                          'auth.login.email.required',
                          'البريد الإلكتروني مطلوب'
                        ),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t(
                            'auth.login.email.invalid',
                            'عنوان البريد الإلكتروني غير صحيح'
                          ),
                        },
                      })}
                      className="pl-10"
                      placeholder={t(
                        'auth.login.email.placeholder',
                        'أدخل بريدك الإلكتروني'
                      )}
                      ref={emailRef}
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
                    {t('auth.login.password.label', 'كلمة المرور')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password', {
                        required: t(
                          'auth.login.password.required',
                          'كلمة المرور مطلوبة'
                        ),
                      })}
                      className="pl-10 pr-12"
                      placeholder={t(
                        'auth.login.password.placeholder',
                        'أدخل كلمة المرور'
                      )}
                      ref={passwordRef}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword
                          ? t('auth.login.password.hide', 'إخفاء كلمة المرور')
                          : t('auth.login.password.show', 'إظهار كلمة المرور')
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="mr-2 text-sm text-gray-600">
                      {t('auth.login.remember', 'تذكرني')}
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {t('auth.login.forgotPassword', 'نسيت كلمة المرور؟')}
                  </Link>
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
                      {t('auth.login.submit', 'تسجيل الدخول')}
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
                      {t('auth.login.or', 'أو')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  {t('auth.login.noAccount', 'ليس لديك حساب؟')}{' '}
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    {t('auth.login.register', 'سجل هنا')}
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

export default Login;
