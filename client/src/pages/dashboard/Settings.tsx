import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  User,
  Shield,
  Globe,
  Palette,
  LogOut,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );
  const [showPassword, setShowPassword] = useState(false);

  // Profile Form - معلومات بسيطة
  const [profileForm, setProfileForm] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
  });

  // Security Form - تغيير كلمة المرور
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // محاكاة بسيطة
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('تم تحديث الملف الشخصي بنجاح');
      setMessageType('success');
    } catch (error) {
      setMessage('حدث خطأ أثناء تحديث الملف الشخصي');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        setMessage('كلمة المرور الجديدة غير متطابقة');
        setMessageType('error');
        return;
      }

      if (securityForm.newPassword.length < 6) {
        setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setMessageType('error');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('تم تغيير كلمة المرور بنجاح');
      setMessageType('success');

      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage('حدث خطأ أثناء تغيير كلمة المرور');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('settings.title', 'الإعدادات')}
        </h1>
        <p className="text-gray-600">
          {t('settings.subtitle', 'إدارة إعدادات حسابك')}
        </p>
      </motion.div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert
            type={messageType}
            title={messageType === 'success' ? 'نجح' : 'خطأ'}
            message={message}
            onClose={() => setMessage('')}
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {t('settings.profile.title', 'الملف الشخصي')}
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.profile.firstName', 'الاسم الأول')}
                </label>
                <Input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.profile.lastName', 'الاسم الأخير')}
                </label>
                <Input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.profile.email', 'البريد الإلكتروني')}
                </label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('settings.save', 'حفظ التغييرات')}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {t('settings.security.title', 'الأمان')}
              </h2>
            </div>

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    'settings.security.currentPassword',
                    'كلمة المرور الحالية'
                  )}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={securityForm.currentPassword}
                    onChange={(e) =>
                      setSecurityForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.security.newPassword', 'كلمة المرور الجديدة')}
                </label>
                <Input
                  type="password"
                  value={securityForm.newPassword}
                  onChange={(e) =>
                    setSecurityForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.security.confirmPassword', 'تأكيد كلمة المرور')}
                </label>
                <Input
                  type="password"
                  value={securityForm.confirmPassword}
                  onChange={(e) =>
                    setSecurityForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {t('settings.security.changePassword', 'تغيير كلمة المرور')}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <Card className="p-6 border-primary-200 bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-1">
                {t('settings.logout.title', 'تسجيل الخروج')}
              </h3>
              <p className="text-sm text-primary-700">
                {t('settings.logout.description', 'تسجيل الخروج من الحساب')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-primary-300 text-primary-700 hover:bg-primary-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('settings.logout.button', 'تسجيل الخروج')}
            </Button>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsDashboard;
