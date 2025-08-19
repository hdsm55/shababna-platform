import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Alert from './Alert';
import Modal from './Modal';
import { loginApi } from '../../services/api';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
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
    try {
      setLoginError('');
      const response = await loginApi(data.email, data.password);
      if (!response.success) {
        setLoginError(response.message || 'فشل في تسجيل الدخول.');
        return;
      }
      if (!response.data || !response.data.user || !response.data.token) {
        setLoginError('استجابة السيرفر غير متوقعة. يرجى المحاولة لاحقًا.');
        return;
      }
      const { user, token } = response.data;
      login(user, token);
      localStorage.setItem('token', token);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
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
    <Modal
      open={open}
      onClose={onClose}
      title={t('auth.login.title') || 'تسجيل الدخول'}
      size="sm"
    >
      <Card className="p-0 shadow-none border-0 bg-transparent">
        {loginError && (
          <Alert type="error" className="mb-6 text-center">
            {loginError}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('auth.login.email') || 'البريد الإلكتروني'}
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
                  required:
                    t('auth.login.email') + ' ' + t('common.error.required'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      t('common.error.invalidEmail') ||
                      'عنوان البريد الإلكتروني غير صحيح',
                  },
                })}
                className="pl-10 rtl:pr-10 rtl:pl-4"
                placeholder={t('auth.login.email')}
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
              {t('auth.login.password') || 'كلمة المرور'}
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
                  required:
                    t('auth.login.password') + ' ' + t('common.error.required'),
                })}
                className="pl-10 rtl:pr-10 rtl:pl-4 pr-12"
                placeholder={t('auth.login.password')}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={
                  showPassword
                    ? t('auth.login.hidePassword')
                    : t('auth.login.showPassword')
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

          <Button
            type="submit"
            className="w-full py-3 text-lg font-bold rounded-lg bg-primary-600 hover:bg-primary-700 transition text-white flex items-center justify-center gap-2 shadow-md mt-2"
            icon={LogIn}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {t('auth.login.submit') || 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>
    </Modal>
  );
};

export default LoginModal;
