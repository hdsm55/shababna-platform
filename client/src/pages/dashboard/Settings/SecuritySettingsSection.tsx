import React from 'react';
import Button from '../../../components/common/Button';
import { Key, CheckCircle, Bell, Lock, Monitor } from 'lucide-react';

interface SecuritySettingsSectionProps {
  settings: any;
  handleOpenModal?: (section: string) => void;
  handlePreferenceChange?: (key: string, value: any) => void;
  formatDate?: (date: string) => string;
}

const SecuritySettingsSection: React.FC<SecuritySettingsSectionProps> = ({
  settings,
  handleOpenModal,
  handlePreferenceChange,
  formatDate,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">إعدادات الأمان</h2>
      {handleOpenModal && (
        <Button
          onClick={() => handleOpenModal('security')}
          icon={Key}
          size="sm"
        >
          تغيير كلمة المرور
        </Button>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-4 bg-success-50 rounded-lg">
        <div className="flex items-center mb-2">
          <CheckCircle className="w-5 h-5 text-success-600 mr-2 rtl:ml-2 rtl:mr-0" />
          <h3 className="font-medium text-green-900">المصادقة الثنائية</h3>
        </div>
        <p className="text-sm text-green-700">
          {settings.security.twoFactorEnabled ? 'مفعلة' : 'غير مفعلة'}
        </p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Bell className="w-5 h-5 text-blue-600 mr-2 rtl:ml-2 rtl:mr-0" />
          <h3 className="font-medium text-blue-900">إشعارات تسجيل الدخول</h3>
        </div>
        <p className="text-sm text-blue-700">
          {settings.security.loginNotifications ? 'مفعلة' : 'غير مفعلة'}
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Lock className="w-5 h-5 text-gray-600 mr-2 rtl:ml-2 rtl:mr-0" />
          <h3 className="font-medium text-gray-900">آخر تغيير لكلمة المرور</h3>
        </div>
        <p className="text-sm text-gray-700">
          {formatDate
            ? formatDate(settings.security.passwordLastChanged)
            : settings.security.passwordLastChanged}
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Monitor className="w-5 h-5 text-gray-600 mr-2 rtl:ml-2 rtl:mr-0" />
          <h3 className="font-medium text-gray-900">الجلسات النشطة</h3>
        </div>
        <p className="text-sm text-gray-700">
          {settings.security.activeSessions} جلسة نشطة
        </p>
      </div>
    </div>
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">خيارات متقدمة</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">مهلة انتهاء الجلسة</h4>
            <p className="text-sm text-gray-600">
              الوقت قبل انتهاء صلاحية الجلسة
            </p>
          </div>
          {handlePreferenceChange && (
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) =>
                handlePreferenceChange('sessionTimeout', e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={15}>15 دقيقة</option>
              <option value={30}>30 دقيقة</option>
              <option value={60}>ساعة واحدة</option>
              <option value={120}>ساعتين</option>
            </select>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default SecuritySettingsSection;
