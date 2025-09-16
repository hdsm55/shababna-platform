import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { loginApi } from '../../services/api';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    console.log('🔍 بيانات النموذج:', data);

    setIsLoading(true);
    setError('');

    try {
      const response = await loginApi(data.email, data.password);
      console.log('🔍 استجابة API:', response);

      if (response.success) {
        const { user, token } = response.data;

        const authUser = {
          id: user.id,
          first_name: user.first_name || user.firstName,
          last_name: user.last_name || user.lastName,
          email: user.email,
          role: user.role,
        };

        login(authUser, token);
        localStorage.setItem('token', token);
        console.log('🔍 تم تسجيل الدخول بنجاح:', { user: authUser, token });

        // توجيه المستخدمين حسب دورهم
        if (authUser.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || 'فشل في تسجيل الدخول');
      }
    } catch (error: any) {
      console.error('❌ خطأ:', error);
      setError(
        error.response?.data?.message ||
          'فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* البطاقة الرئيسية */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* العودة */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
              العودة للصفحة الرئيسية
            </button>
          </div>

          {/* العنوان */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600">
              ادخل بياناتك للانضمام إلى مجتمع شبابنا
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
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
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'كلمة المرور مطلوبة',
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* خيارات إضافية */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="mr-2 text-sm text-gray-700">تذكرني</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  دخول
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* رابط التسجيل */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
