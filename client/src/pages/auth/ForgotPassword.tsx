import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forgotPasswordApi } from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const {} = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setEmail(data.email);

    try {
      const response = await forgotPasswordApi(data.email);

      if (response.success) {
        setIsSubmitted(true);
      } else {
        setError(
          response.message || 'فشل في إرسال طلب إعادة تعيين كلمة المرور'
        );
      }
    } catch (error: unknown) {
      console.error('❌ خطأ:', error);
      setError(
        (error as any)?.response?.data?.message ||
          'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              تم إرسال الطلب بنجاح
            </h1>

            <p className="text-gray-600 mb-6">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى{' '}
              <span className="font-semibold text-blue-600">{email}</span>
            </p>

            <p className="text-sm text-gray-500 mb-8">
              يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة
              المرور. إذا لم تجد الرسالة، تحقق من مجلد الرسائل المهملة.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                العودة لتسجيل الدخول
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-blue-600 hover:text-blue-500 font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* العودة */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة لتسجيل الدخول
            </button>
          </div>

          {/* العنوان */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              نسيان كلمة المرور
            </h1>
            <p className="text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
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

            {/* زر إرسال */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال رابط إعادة التعيين'
              )}
            </button>
          </form>

          {/* رابط التسجيل */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              تذكرت كلمة المرور؟{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
