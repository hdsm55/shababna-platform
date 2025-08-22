import React from 'react';
import {
  Mail,
  Smartphone,
  Bell,
  Calendar,
  Settings as SettingsIcon,
} from 'lucide-react';

interface NotificationsSettingsSectionProps {
  settings: any;
  handleNotificationChange?: (key: string, value: boolean) => void;
}

const NotificationsSettingsSection: React.FC<
  NotificationsSettingsSectionProps
> = ({ settings, handleNotificationChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">إعدادات الإشعارات</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
          <div>
            <h3 className="font-medium text-gray-900">
              إشعارات البريد الإلكتروني
            </h3>
            <p className="text-sm text-gray-600">
              استلام إشعارات عبر البريد الإلكتروني
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.email}
            onChange={
              handleNotificationChange
                ? (e) => handleNotificationChange('email', e.target.checked)
                : undefined
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center">
          <Smartphone className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
          <div>
            <h3 className="font-medium text-gray-900">
              إشعارات الرسائل النصية
            </h3>
            <p className="text-sm text-gray-600">
              استلام إشعارات عبر الرسائل النصية
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.sms}
            onChange={
              handleNotificationChange
                ? (e) => handleNotificationChange('sms', e.target.checked)
                : undefined
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
          <div>
            <h3 className="font-medium text-gray-900">إشعارات الموقع</h3>
            <p className="text-sm text-gray-600">
              استلام إشعارات فورية في الموقع
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.push}
            onChange={
              handleNotificationChange
                ? (e) => handleNotificationChange('push', e.target.checked)
                : undefined
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
            <div>
              <h3 className="font-medium text-gray-900">الفعاليات</h3>
              <p className="text-sm text-gray-600">إشعارات الفعاليات الجديدة</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.events}
              onChange={
                handleNotificationChange
                  ? (e) => handleNotificationChange('events', e.target.checked)
                  : undefined
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center">
            <SettingsIcon className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
            <div>
              <h3 className="font-medium text-gray-900">البرامج</h3>
              <p className="text-sm text-gray-600">إشعارات البرامج الجديدة</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.programs}
              onChange={
                handleNotificationChange
                  ? (e) =>
                      handleNotificationChange('programs', e.target.checked)
                  : undefined
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default NotificationsSettingsSection;
