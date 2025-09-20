// تكوين الأيقونات لضمان تحميلها بشكل صحيح

export const ICON_CONFIG = {
  // الأيقونات الأساسية المطلوبة
  essential: [
    'Calendar',
    'Users',
    'Home',
    'Settings',
    'Bell',
    'User',
    'Mail',
    'Phone',
    'MapPin',
    'Clock',
    'CheckCircle',
    'ArrowLeft',
    'Share2',
    'Globe',
    'Award',
    'Tag',
    'Plus',
    'Edit',
    'Trash2',
    'Eye',
    'Search',
    'Filter',
    'Download',
    'RefreshCw',
    'FileText',
    'MessageCircle',
    'UserPlus',
    'UserCheck',
    'LogOut',
    'LayoutDashboard',
    'Target'
  ],

  // إعدادات التحميل
  loading: {
    timeout: 5000, // مهلة انتظار تحميل الأيقونة (بالميلي ثانية)
    retryAttempts: 3, // عدد محاولات إعادة التحميل
    fallbackEnabled: true, // تفعيل النظام الاحتياطي
  },

  // إعدادات العرض
  display: {
    defaultSize: 24,
    defaultColor: 'currentColor',
    strokeWidth: 2,
  }
};

// دالة لتحميل الأيقونات الأساسية مسبقاً
export const preloadEssentialIcons = async () => {
  try {
    const { ...icons } = await import('lucide-react');
    const essentialIcons = ICON_CONFIG.essential.reduce((acc, iconName) => {
      if (icons[iconName]) {
        acc[iconName] = icons[iconName];
      }
      return acc;
    }, {} as Record<string, any>);

    console.log('✅ تم تحميل الأيقونات الأساسية:', Object.keys(essentialIcons));
    return essentialIcons;
  } catch (error) {
    console.warn('⚠️ فشل في تحميل الأيقونات الأساسية:', error);
    return {};
  }
};

// دالة للتحقق من توفر الأيقونة
export const isIconAvailable = (iconName: string): boolean => {
  try {
    // محاولة الوصول للأيقونة من الذاكرة المؤقتة
    return ICON_CONFIG.essential.includes(iconName);
  } catch {
    return false;
  }
};

// دالة للحصول على أيقونة احتياطية
export const getFallbackIcon = (iconName: string): string => {
  const fallbackMap: Record<string, string> = {
    'Calendar': '📅',
    'Users': '👥',
    'Home': '🏠',
    'Settings': '⚙️',
    'Bell': '🔔',
    'User': '👤',
    'Mail': '📧',
    'Phone': '📞',
    'MapPin': '📍',
    'Clock': '🕐',
    'CheckCircle': '✅',
    'ArrowLeft': '⬅️',
    'Share2': '🔗',
    'Globe': '🌐',
    'Award': '🏆',
    'Tag': '🏷️',
    'Plus': '➕',
    'Edit': '✏️',
    'Trash2': '🗑️',
    'Eye': '👁️',
    'Search': '🔍',
    'Filter': '🔽',
    'Download': '⬇️',
    'RefreshCw': '🔄',
    'FileText': '📄',
    'MessageCircle': '💬',
    'UserPlus': '👤➕',
    'UserCheck': '👤✅',
    'LogOut': '🚪',
    'LayoutDashboard': '📊',
    'Target': '🎯'
  };

  return fallbackMap[iconName] || '❓';
};
