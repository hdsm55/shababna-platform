import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import { registerApi } from '../../services/api';

interface AdminFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>();

  const password = watch('password');

  // تحقق من وجود admin عند تحميل الصفحة
  useEffect(() => {
    fetch('/api/auth/admin-exists')
      .then((res) => res.json())
      .then((data) => {
        setAdminExists(data.exists);
        setLoading(false);
        if (data.exists) {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  const onSubmit = async (data: AdminFormData) => {
    try {
      setRegisterError('');
      // استدعاء API مع بيانات admin
      const response = await registerApi({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      if (!response.success) {
        setRegisterError(response.message || 'فشل في إنشاء الحساب.');
        return;
      }
      // توجيه إلى لوحة التحكم بعد النجاح
      navigate('/dashboard');
    } catch (error: any) {
      setRegisterError(
        error?.response?.data?.message ||
          'فشل في إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            إنشاء حساب مشرف جديد
          </h1>
          <p className="text-gray-600">
            هذه الصفحة مخصصة لإنشاء أول حساب مشرف (admin) في المنصة. بعد
            الإنشاء، يمكنك تسجيل الدخول وإدارة لوحة التحكم.
          </p>
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
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الاسم الأول
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <input
                    id="first_name"
                    type="text"
                    {...register('first_name', {
                      required: 'الاسم الأول مطلوب',
                    })}
                    className="pl-10 rtl:pr-10 rtl:pl-4 input input-bordered w-full"
                    placeholder="الاسم الأول"
                    aria-describedby="first_name-error"
                  />
                </div>
                {errors.first_name && (
                  <p
                    id="first_name-error"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  اسم العائلة
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    aria-hidden="true"
                  />
                  <input
                    id="last_name"
                    type="text"
                    {...register('last_name', {
                      required: 'اسم العائلة مطلوب',
                    })}
                    className="pl-10 rtl:pr-10 rtl:pl-4 input input-bordered w-full"
                    placeholder="اسم العائلة"
                    aria-describedby="last_name-error"
                  />
                </div>
                {errors.last_name && (
                  <p
                    id="last_name-error"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
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
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'البريد الإلكتروني مطلوب',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'عنوان البريد الإلكتروني غير صحيح',
                    },
                  })}
                  className="pl-10 rtl:pr-10 rtl:pl-4 input input-bordered w-full"
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
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'كلمة المرور مطلوبة',
                    minLength: {
                      value: 6,
                      message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                    },
                  })}
                  className="pl-10 rtl:pr-10 rtl:pl-4 pr-12 input input-bordered w-full"
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'تأكيد كلمة المرور مطلوب',
                    validate: (value) =>
                      value === password || 'كلمتا المرور غير متطابقتين',
                  })}
                  className="pl-10 rtl:pr-10 rtl:pl-4 pr-12 input input-bordered w-full"
                  placeholder="تأكيد كلمة المرور"
                  aria-describedby="confirmPassword-error"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              icon={UserPlus}
              className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              إنشاء حساب مشرف
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateAdmin;
