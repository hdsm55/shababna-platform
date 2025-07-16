import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { loginApi } from '../../services/api';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ mode: 'onTouched' });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form data:', data);
    try {
      setLoginError('');
      const response = await loginApi(data.email, data.password);
      if (!response.success) {
        setLoginError(response.message || 'فشل في تسجيل الدخول.');
        return;
      }
      // تحقق من وجود user و token في الاستجابة
      if (!response.data || !response.data.user || !response.data.token) {
        setLoginError('استجابة السيرفر غير متوقعة. يرجى المحاولة لاحقًا.');
        console.error('شكل استجابة السيرفر غير متوقع:', response);
        return;
      }
      const { user, token } = response.data;
      login(user, token);
      localStorage.setItem('token', token);
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError(
          'فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        );
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
        dir={i18n.dir()}
      >
        <Card className="p-8 shadow-2xl rounded-2xl border-0">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span
                className="text-white font-bold text-xl"
                aria-label="شعار شبابنا"
              >
                ش
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {t('auth.login.title') || 'تسجيل الدخول'}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('auth.login.subtitle') || 'سجل الدخول إلى حسابك'}
            </p>
          </div>

          {loginError && (
            <Alert type="error" className="mb-6 text-center">
              {loginError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'البريد الإلكتروني مطلوب',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'عنوان البريد الإلكتروني غير صحيح',
                    },
                  })}
                  className="pl-10 rtl:pr-10 rtl:pl-4"
                  placeholder="أدخل بريدك الإلكتروني"
                  aria-describedby="email-error"
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-red-600 text-sm mt-1"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'كلمة المرور مطلوبة',
                  })}
                  className="pl-10 rtl:pr-10 rtl:pl-4 pr-12"
                  placeholder="أدخل كلمة المرور"
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={
                    showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-red-600 text-sm mt-1"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center select-none">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-describedby="remember-me-description"
                />
                <span className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-600">
                  تذكرني
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg font-bold rounded-lg bg-primary-600 hover:bg-primary-700 transition text-white flex items-center justify-center gap-2 shadow-md mt-2"
              icon={LogIn}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-bold"
            >
              سجل هنا
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
