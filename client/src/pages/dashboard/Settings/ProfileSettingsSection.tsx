import React from 'react';
import Button from '../../../components/common/Button';
import { Edit } from 'lucide-react';

interface ProfileSettingsSectionProps {
  settings: any;
  handleOpenModal?: (section: string) => void;
}

const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  settings,
  handleOpenModal,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">الملف الشخصي</h2>
      {handleOpenModal && (
        <Button
          onClick={() => handleOpenModal('profile')}
          icon={Edit}
          size="sm"
        >
          تعديل
        </Button>
      )}
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl">
        {settings.profile.avatar}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {settings.profile.firstName} {settings.profile.lastName}
        </h3>
        <p className="text-gray-600">{settings.profile.email}</p>
        <p className="text-sm text-gray-500">{settings.profile.location}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الأول
        </label>
        <p className="text-gray-900">{settings.profile.firstName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الأخير
        </label>
        <p className="text-gray-900">{settings.profile.lastName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <p className="text-gray-900">{settings.profile.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الهاتف
        </label>
        <p className="text-gray-900">{settings.profile.phone}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الموقع
        </label>
        <p className="text-gray-900">{settings.profile.location}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الموقع الإلكتروني
        </label>
        <p className="text-gray-900">{settings.profile.website}</p>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          السيرة الذاتية
        </label>
        <p className="text-gray-900">{settings.profile.bio}</p>
      </div>
    </div>
  </div>
);

export default ProfileSettingsSection;
