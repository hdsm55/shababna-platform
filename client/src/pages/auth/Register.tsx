import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { registerApi } from '../../services/api';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState('');

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
      // استدعاء API الفعلي
      const response = await registerApi({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });
      if (!response.success) {
        setRegisterError(response.message || 'فشل في إنشاء الحساب.');
        return;
      }
      const { user, token } = response.data;
      // أضف role بناءً على is_admin
      const userWithRole = { ...user, role: user.is_admin ? 'admin' : 'user' };
      login(userWithRole, token);
      localStorage.setItem('token', token);
      if (userWithRole.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setRegisterError(error.response.data.message);
      } else {
        setRegisterError(
          'فشل في إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        );
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SkipToContent />

      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')] bg-cover bg-center opacity-5"></div>

      <AccessibleSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span
                  className="text-white font-bold text-xl"
                  aria-label="شعار شبابنا"
                >
                  ش
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.register.title')}
            </h1>
            <p className="text-gray-600">{t('auth.register.subtitle')}</p>
          </div>

          <Card className="p-8 shadow-2xl">
            {registerError && (
              <Alert type="error" className="mb-6">
                {registerError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.register.firstName')}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      aria-hidden="true"
                    />
                    <Input
                      id="firstName"
                      type="text"
                      {...register('firstName', {
                        required: 'الاسم الأول مطلوب',
                      })}
                      className="pl-10 rtl:pr-10 rtl:pl-4"
                      placeholder="الاسم الأول"
                      aria-describedby="firstName-error"
                    />
                  </div>
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      className="text-red-600 text-sm mt-1"
                      role="alert"
                    >
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('auth.register.lastName')}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      aria-hidden="true"
                    />
                    <Input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'الاسم الأخير مطلوب',
                      })}
                      className="pl-10 rtl:pr-10 rtl:pl-4"
                      placeholder="الاسم الأخير"
                      aria-describedby="lastName-error"
                    />
                  </div>
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      className="text-red-600 text-sm mt-1"
                      role="alert"
                    >
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('auth.register.email')}
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
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
                  {t('auth.register.password')}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'كلمة المرور مطلوبة',
                      minLength: {
                        value: 6,
                        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                      },
                    })}
                    className="pl-10 rtl:pr-10 rtl:pl-4 pr-12"
                    placeholder="أدخل كلمة المرور"
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('auth.register.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'تأكيد كلمة المرور مطلوب',
                      validate: (value) =>
                        value === password || 'كلمتا المرور غير متطابقتين',
                    })}
                    className="pl-10 rtl:pr-10 rtl:pl-4 pr-12"
                    placeholder="تأكيد كلمة المرور"
                    aria-describedby="confirmPassword-error"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                    aria-label={
                      showConfirmPassword
                        ? 'إخفاء كلمة المرور'
                        : 'إظهار كلمة المرور'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  required
                  aria-describedby="terms-description"
                />
                <label
                  htmlFor="terms"
                  className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-600"
                >
                  أوافق على{' '}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    aria-label="الشروط والأحكام"
                  >
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    aria-label="سياسة الخصوصية"
                  >
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>
              <p id="terms-description" className="sr-only">
                يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة
              </p>

              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                icon={UserPlus}
                iconPosition="right"
                className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                aria-describedby="register-description"
              >
                {t('auth.register.submit')}
              </Button>

              <p id="register-description" className="sr-only">
                اضغط Enter لإنشاء الحساب
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.register.haveAccount')}{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  aria-label="تسجيل الدخول"
                >
                  {t('auth.register.login')}
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </AccessibleSection>
    </div>
  );
};

export default Register;
