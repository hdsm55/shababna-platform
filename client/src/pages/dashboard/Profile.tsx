import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  Edit3,
} from 'lucide-react';
import { api } from '../../services/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  dateOfBirth: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  events: boolean;
  programs: boolean;
  donations: boolean;
  updates: boolean;
  marketing: boolean;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'password' | 'notifications' | 'privacy'
  >('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // نموذج الملف الشخصي
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    dateOfBirth: '',
  });

  // نموذج تغيير كلمة المرور
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // إعدادات الإشعارات
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      email: true,
      sms: false,
      push: true,
      events: true,
      programs: true,
      donations: true,
      updates: true,
      marketing: false,
    });

  // جلب بيانات الملف الشخصي
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.get('/users/profile').then((res) => res.data),
  });

  // تحديث الملف الشخصي
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.put('/users/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
      setError('');
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي'
      );
    },
  });

  // تغيير كلمة المرور
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => api.put('/users/password', data),
    onSuccess: () => {
      setSuccess('تم تغيير كلمة المرور بنجاح');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setError('');
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور'
      );
    },
  });

  // تحديث إعدادات الإشعارات
  const updateNotificationsMutation = useMutation({
    mutationFn: (data: NotificationSettings) =>
      api.put('/users/notifications', data),
    onSuccess: () => {
      setSuccess('تم تحديث إعدادات الإشعارات بنجاح');
      setError('');
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || 'حدث خطأ أثناء تحديث الإشعارات'
      );
    },
  });

  // تحديث البيانات عند تحميل الملف الشخصي
  React.useEffect(() => {
    if (profile?.data) {
      const userData = profile.data;
      setProfileForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        website: userData.website || '',
        bio: userData.bio || '',
        dateOfBirth: userData.dateOfBirth || '',
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    changePasswordMutation.mutate(passwordForm);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationsMutation.mutate(notificationSettings);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'default'}
        >
          {isEditing ? (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              إلغاء التعديل
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              تعديل الملف
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" title="خطأ">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="default" title="نجح">
          {success}
        </Alert>
      )}

      {/* تبويبات التنقل */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'profile', label: 'الملف الشخصي', icon: User },
          { id: 'password', label: 'كلمة المرور', icon: Shield },
          { id: 'notifications', label: 'الإشعارات', icon: Bell },
          { id: 'privacy', label: 'الخصوصية', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* تبويب الملف الشخصي */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* صورة الملف الشخصي */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    {profile?.data?.avatar ? (
                      <img
                        src={profile.data.avatar}
                        alt="صورة الملف الشخصي"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{profile?.data?.name}</h3>
                  <p className="text-sm text-gray-500">{profile?.data?.role}</p>
                  <p className="text-xs text-gray-400">
                    عضو منذ {formatDate(profile?.data?.createdAt || '')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    الاسم الكامل *
                  </label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    رقم الهاتف
                  </label>
                  <Input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">الموقع</label>
                  <Input
                    value={profileForm.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    الموقع الإلكتروني
                  </label>
                  <Input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) =>
                      handleInputChange('website', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    تاريخ الميلاد
                  </label>
                  <Input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange('dateOfBirth', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">نبذة شخصية</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="اكتب نبذة عن نفسك..."
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* تبويب كلمة المرور */}
      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              تغيير كلمة المرور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  كلمة المرور الحالية *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange('currentPassword', e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  كلمة المرور الجديدة *
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordChange('newPassword', e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  تأكيد كلمة المرور الجديدة *
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange('confirmPassword', e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      تغيير كلمة المرور
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* تبويب الإشعارات */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">
                        {key === 'email' && 'إشعارات البريد الإلكتروني'}
                        {key === 'sms' && 'إشعارات الرسائل النصية'}
                        {key === 'push' && 'إشعارات الموقع'}
                        {key === 'events' && 'إشعارات الفعاليات'}
                        {key === 'programs' && 'إشعارات البرامج'}
                        {key === 'donations' && 'إشعارات التبرعات'}
                        {key === 'updates' && 'إشعارات التحديثات'}
                        {key === 'marketing' && 'إشعارات التسويق'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {key === 'email' &&
                          'استلام إشعارات عبر البريد الإلكتروني'}
                        {key === 'sms' && 'استلام إشعارات عبر الرسائل النصية'}
                        {key === 'push' && 'استلام إشعارات في المتصفح'}
                        {key === 'events' && 'إشعارات عن الفعاليات الجديدة'}
                        {key === 'programs' && 'إشعارات عن البرامج الجديدة'}
                        {key === 'donations' && 'إشعارات عن التبرعات'}
                        {key === 'updates' && 'إشعارات عن تحديثات الموقع'}
                        {key === 'marketing' && 'إشعارات تسويقية'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleNotificationChange(
                          key as keyof NotificationSettings,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateNotificationsMutation.isPending}
                >
                  {updateNotificationsMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* تبويب الخصوصية */}
      {activeTab === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              إعدادات الخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  معلومات الخصوصية
                </h4>
                <p className="text-sm text-blue-700">
                  نحن نحترم خصوصيتك ونحمي بياناتك الشخصية. جميع البيانات محمية
                  ومشفرة.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">عرض الملف الشخصي</h4>
                    <p className="text-sm text-gray-500">
                      السماح للآخرين برؤية ملفك الشخصي
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">عرض البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-500">
                      السماح للآخرين برؤية بريدك الإلكتروني
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">عرض رقم الهاتف</h4>
                    <p className="text-sm text-gray-500">
                      السماح للآخرين برؤية رقم هاتفك
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ إعدادات الخصوصية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
