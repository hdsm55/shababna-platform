import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Key,
  Smartphone,
  Mail,
  Calendar,
  MapPin,
  Camera,
  Trash2,
  Download,
  Upload,
  Database,
  Monitor,
  Wifi,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Languages,
  Rss,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    dateOfBirth: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    events: boolean;
    programs: boolean;
    donations: boolean;
    updates: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number;
    passwordLastChanged: string;
    lastLogin: string;
    activeSessions: number;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
    dateFormat: string;
    currency: string;
    rtl: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    allowFriendRequests: boolean;
  };
}

const SettingsDashboard: React.FC = () => {
  // جلب إعدادات المستخدم
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => fetchUserSettings(),
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'profile' | 'security' | 'export' | 'delete'
  >('profile');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // نموذج البيانات
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // بيانات افتراضية للإعدادات
  const mockSettings: UserSettings = {
    profile: {
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      avatar: 'AM',
      bio: 'مدير المنظمة ومؤسسها، مهتم بتطوير الشباب والمجتمع',
      location: 'الرياض، السعودية',
      website: 'https://ahmed-mohammed.com',
      dateOfBirth: '1990-05-15',
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      events: true,
      programs: true,
      donations: false,
      updates: true,
      marketing: false,
    },
    security: {
      twoFactorEnabled: true,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordLastChanged: '2024-01-15',
      lastLogin: '2024-06-01T10:30:00Z',
      activeSessions: 2,
    },
    preferences: {
      language: 'ar',
      theme: 'auto',
      timezone: 'Asia/Riyadh',
      dateFormat: 'DD/MM/YYYY',
      currency: 'SAR',
      rtl: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessages: true,
      allowFriendRequests: true,
    },
  };

  const settings = data || mockSettings;

  // Mock API function
  const fetchUserSettings = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockSettings;
  };

  const handleOpenModal = (
    type: 'profile' | 'security' | 'export' | 'delete'
  ) => {
    setModalType(type);
    setFormError('');
    setSuccessMessage('');
    setForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormError('');
    setSuccessMessage('');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'security') {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        setFormError('جميع الحقول مطلوبة');
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setFormError('كلمة المرور الجديدة غير متطابقة');
        return;
      }
      if (form.newPassword.length < 8) {
        setFormError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        return;
      }
    }
    // هنا سيتم الربط مع API لاحقًا
    console.log('Form submitted:', form);
    setSuccessMessage('تم حفظ الإعدادات بنجاح');
    setTimeout(() => {
      setModalOpen(false);
      setSuccessMessage('');
    }, 2000);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    // هنا سيتم تحديث الإعدادات
    console.log('Notification setting changed:', key, value);
  };

  const handlePrivacyChange = (key: string, value: any) => {
    // هنا سيتم تحديث إعدادات الخصوصية
    console.log('Privacy setting changed:', key, value);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    // هنا سيتم تحديث التفضيلات
    console.log('Preference changed:', key, value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'profile':
        return User;
      case 'notifications':
        return Bell;
      case 'security':
        return Shield;
      case 'preferences':
        return SettingsIcon;
      case 'privacy':
        return Lock;
      default:
        return SettingsIcon;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'profile':
        return 'الملف الشخصي';
      case 'notifications':
        return 'الإشعارات';
      case 'security':
        return 'الأمان';
      case 'preferences':
        return 'التفضيلات';
      case 'privacy':
        return 'الخصوصية';
      default:
        return 'الإعدادات';
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل الإعدادات">
            حدث خطأ أثناء جلب إعدادات المستخدم. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'preferences', label: 'التفضيلات', icon: SettingsIcon },
    { id: 'privacy', label: 'الخصوصية', icon: Lock },
  ];

  return (
    <DashboardLayout>
      <SkipToContent />

      <AccessibleSection>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
            <p className="text-gray-600">إدارة إعدادات حسابك وتفضيلاتك</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <div className="p-6">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-900">
                            الملف الشخصي
                          </h2>
                          <Button
                            onClick={() => handleOpenModal('profile')}
                            icon={Edit}
                            size="sm"
                          >
                            تعديل
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl">
                            {settings.profile.avatar}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {settings.profile.firstName}{' '}
                              {settings.profile.lastName}
                            </h3>
                            <p className="text-gray-600">
                              {settings.profile.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {settings.profile.location}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الاسم الأول
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.firstName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الاسم الأخير
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.lastName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              البريد الإلكتروني
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.email}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              رقم الهاتف
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.phone}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الموقع
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.location}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              الموقع الإلكتروني
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.website}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              السيرة الذاتية
                            </label>
                            <p className="text-gray-900">
                              {settings.profile.bio}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          إعدادات الإشعارات
                        </h2>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                                onChange={(e) =>
                                  handleNotificationChange(
                                    'email',
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                                onChange={(e) =>
                                  handleNotificationChange(
                                    'sms',
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Bell className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  إشعارات الموقع
                                </h3>
                                <p className="text-sm text-gray-600">
                                  استلام إشعارات فورية في الموقع
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.push}
                                onChange={(e) =>
                                  handleNotificationChange(
                                    'push',
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    الفعاليات
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    إشعارات الفعاليات الجديدة
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.events}
                                  onChange={(e) =>
                                    handleNotificationChange(
                                      'events',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <SettingsIcon className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    البرامج
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    إشعارات البرامج الجديدة
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.notifications.programs}
                                  onChange={(e) =>
                                    handleNotificationChange(
                                      'programs',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-900">
                            إعدادات الأمان
                          </h2>
                          <Button
                            onClick={() => handleOpenModal('security')}
                            icon={Key}
                            size="sm"
                          >
                            تغيير كلمة المرور
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2 rtl:ml-2 rtl:mr-0" />
                              <h3 className="font-medium text-green-900">
                                المصادقة الثنائية
                              </h3>
                            </div>
                            <p className="text-sm text-green-700">
                              {settings.security.twoFactorEnabled
                                ? 'مفعلة'
                                : 'غير مفعلة'}
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Bell className="w-5 h-5 text-blue-600 mr-2 rtl:ml-2 rtl:mr-0" />
                              <h3 className="font-medium text-blue-900">
                                إشعارات تسجيل الدخول
                              </h3>
                            </div>
                            <p className="text-sm text-blue-700">
                              {settings.security.loginNotifications
                                ? 'مفعلة'
                                : 'غير مفعلة'}
                            </p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Lock className="w-5 h-5 text-gray-600 mr-2 rtl:ml-2 rtl:mr-0" />
                              <h3 className="font-medium text-gray-900">
                                آخر تغيير لكلمة المرور
                              </h3>
                            </div>
                            <p className="text-sm text-gray-700">
                              {formatDate(
                                settings.security.passwordLastChanged
                              )}
                            </p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Monitor className="w-5 h-5 text-gray-600 mr-2 rtl:ml-2 rtl:mr-0" />
                              <h3 className="font-medium text-gray-900">
                                الجلسات النشطة
                              </h3>
                            </div>
                            <p className="text-sm text-gray-700">
                              {settings.security.activeSessions} جلسة نشطة
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            خيارات متقدمة
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  مهلة انتهاء الجلسة
                                </h4>
                                <p className="text-sm text-gray-600">
                                  الوقت قبل انتهاء صلاحية الجلسة
                                </p>
                              </div>
                              <select
                                value={settings.security.sessionTimeout}
                                onChange={(e) =>
                                  handlePreferenceChange(
                                    'sessionTimeout',
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value={15}>15 دقيقة</option>
                                <option value={30}>30 دقيقة</option>
                                <option value={60}>ساعة واحدة</option>
                                <option value={120}>ساعتين</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preferences Settings */}
                    {activeTab === 'preferences' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          التفضيلات
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              اللغة
                            </label>
                            <select
                              value={settings.preferences.language}
                              onChange={(e) =>
                                handlePreferenceChange(
                                  'language',
                                  e.target.value
                                )
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
                              onChange={(e) =>
                                handlePreferenceChange('theme', e.target.value)
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
                              onChange={(e) =>
                                handlePreferenceChange(
                                  'timezone',
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="Asia/Riyadh">
                                الرياض (GMT+3)
                              </option>
                              <option value="Asia/Jeddah">جدة (GMT+3)</option>
                              <option value="Asia/Dammam">
                                الدمام (GMT+3)
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              العملة
                            </label>
                            <select
                              value={settings.preferences.currency}
                              onChange={(e) =>
                                handlePreferenceChange(
                                  'currency',
                                  e.target.value
                                )
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
                              <p className="text-sm text-gray-600">
                                تفعيل دعم اللغة العربية
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.preferences.rtl}
                              onChange={(e) =>
                                handlePreferenceChange('rtl', e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          إعدادات الخصوصية
                        </h2>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              رؤية الملف الشخصي
                            </label>
                            <select
                              value={settings.privacy.profileVisibility}
                              onChange={(e) =>
                                handlePrivacyChange(
                                  'profileVisibility',
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="public">عام</option>
                              <option value="private">خاص</option>
                              <option value="friends">الأصدقاء فقط</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <Mail className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    إظهار البريد الإلكتروني
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    السماح للآخرين برؤية بريدك الإلكتروني
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy.showEmail}
                                  onChange={(e) =>
                                    handlePrivacyChange(
                                      'showEmail',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <Phone className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    إظهار رقم الهاتف
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    السماح للآخرين برؤية رقم هاتفك
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy.showPhone}
                                  onChange={(e) =>
                                    handlePrivacyChange(
                                      'showPhone',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    إظهار الموقع
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    السماح للآخرين برؤية موقعك
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy.showLocation}
                                  onChange={(e) =>
                                    handlePrivacyChange(
                                      'showLocation',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <Mail className="w-5 h-5 text-gray-600 mr-3 rtl:ml-3 rtl:mr-0" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    السماح بالرسائل
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    السماح للآخرين بإرسال رسائل لك
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy.allowMessages}
                                  onChange={(e) =>
                                    handlePrivacyChange(
                                      'allowMessages',
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'profile'
                ? 'تعديل الملف الشخصي'
                : modalType === 'security'
                ? 'تغيير كلمة المرور'
                : modalType === 'export'
                ? 'تصدير البيانات'
                : 'حذف الحساب'
            }
          >
            {modalType === 'security' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <Alert type="error" className="mb-4">
                    {formError}
                  </Alert>
                )}
                {successMessage && (
                  <Alert type="success" className="mb-4">
                    {successMessage}
                  </Alert>
                )}

                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    كلمة المرور الحالية
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={form.currentPassword}
                      onChange={handleChange}
                      required
                      placeholder="كلمة المرور الحالية"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                      placeholder="كلمة المرور الجديدة"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="تأكيد كلمة المرور الجديدة"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    تغيير كلمة المرور
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            ) : modalType === 'profile' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأول
                    </label>
                    <Input
                      type="text"
                      defaultValue={settings.profile.firstName}
                      placeholder="الاسم الأول"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأخير
                    </label>
                    <Input
                      type="text"
                      defaultValue={settings.profile.lastName}
                      placeholder="الاسم الأخير"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    defaultValue={settings.profile.email}
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <Input
                    type="tel"
                    defaultValue={settings.profile.phone}
                    placeholder="+966501234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الموقع
                  </label>
                  <Input
                    type="text"
                    defaultValue={settings.profile.location}
                    placeholder="المدينة، البلد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السيرة الذاتية
                  </label>
                  <textarea
                    defaultValue={settings.profile.bio}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="نبذة مختصرة عنك"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">حفظ التغييرات</Button>
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {modalType === 'export' ? 'تصدير البيانات' : 'حذف الحساب'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {modalType === 'export'
                    ? 'سيتم تصدير جميع بياناتك الشخصية'
                    : 'هذا الإجراء لا يمكن التراجع عنه'}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={modalType === 'export' ? 'primary' : 'danger'}
                    className="flex-1"
                  >
                    {modalType === 'export' ? 'تصدير' : 'حذف'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default SettingsDashboard;
