import React from 'react';

interface PreferencesSettingsSectionProps {
  settings: any;
  handlePreferenceChange?: (key: string, value: any) => void;
}

const PreferencesSettingsSection: React.FC<PreferencesSettingsSectionProps> = ({
  settings,
  handlePreferenceChange,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">التفضيلات</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اللغة
        </label>
        <select
          value={settings.preferences.language}
          onChange={
            handlePreferenceChange
              ? (e) => handlePreferenceChange('language', e.target.value)
              : undefined
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          المظهر
        </label>
        <select
          value={settings.preferences.theme}
          onChange={
            handlePreferenceChange
              ? (e) => handlePreferenceChange('theme', e.target.value)
              : undefined
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="light">فاتح</option>
          <option value="dark">داكن</option>
          <option value="auto">تلقائي</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          المنطقة الزمنية
        </label>
        <select
          value={settings.preferences.timezone}
          onChange={
            handlePreferenceChange
              ? (e) => handlePreferenceChange('timezone', e.target.value)
              : undefined
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Asia/Riyadh">الرياض (GMT+3)</option>
          <option value="Asia/Jeddah">جدة (GMT+3)</option>
          <option value="Asia/Dammam">الدمام (GMT+3)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العملة
        </label>
        <select
          value={settings.preferences.currency}
          onChange={
            handlePreferenceChange
              ? (e) => handlePreferenceChange('currency', e.target.value)
              : undefined
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="SAR">ريال سعودي (SAR)</option>
          <option value="USD">دولار أمريكي (USD)</option>
          <option value="EUR">يورو (EUR)</option>
        </select>
      </div>
    </div>
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <Languages className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
        <div>
          <h3 className="font-medium text-gray-900">
            اتجاه النص من اليمين لليسار
          </h3>
          <p className="text-sm text-gray-600">تفعيل دعم اللغة العربية</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={settings.preferences.rtl}
          onChange={
            handlePreferenceChange
              ? (e) => handlePreferenceChange('rtl', e.target.checked)
              : undefined
          }
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  </div>
);

export default PreferencesSettingsSection;
