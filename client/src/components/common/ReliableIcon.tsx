import React, { ComponentType } from 'react';
import IconFallbackFixed from './IconFallbackFixed';
import {
  ICON_CONFIG,
  isIconAvailable,
  getFallbackIcon,
} from '../../config/icons';

interface ReliableIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  fallback?: boolean;
}

// استيراد الأيقونات مباشرة مع معالجة الأخطاء
const getIconComponent = (iconName: string): ComponentType<any> | null => {
  try {
    // استيراد الأيقونات الشائعة مباشرة
    const iconMap: {
      [key: string]: () => Promise<{ default: ComponentType<any> }>;
    } = {
      calendar: () =>
        import('lucide-react').then((module) => ({ default: module.Calendar })),
      users: () =>
        import('lucide-react').then((module) => ({ default: module.Users })),
      home: () =>
        import('lucide-react').then((module) => ({ default: module.Home })),
      settings: () =>
        import('lucide-react').then((module) => ({ default: module.Settings })),
      bell: () =>
        import('lucide-react').then((module) => ({ default: module.Bell })),
      user: () =>
        import('lucide-react').then((module) => ({ default: module.User })),
      mail: () =>
        import('lucide-react').then((module) => ({ default: module.Mail })),
      phone: () =>
        import('lucide-react').then((module) => ({ default: module.Phone })),
      'map-pin': () =>
        import('lucide-react').then((module) => ({ default: module.MapPin })),
      clock: () =>
        import('lucide-react').then((module) => ({ default: module.Clock })),
      'check-circle': () =>
        import('lucide-react').then((module) => ({
          default: module.CheckCircle,
        })),
      'arrow-left': () =>
        import('lucide-react').then((module) => ({
          default: module.ArrowLeft,
        })),
      'share-2': () =>
        import('lucide-react').then((module) => ({ default: module.Share2 })),
      globe: () =>
        import('lucide-react').then((module) => ({ default: module.Globe })),
      award: () =>
        import('lucide-react').then((module) => ({ default: module.Award })),
      tag: () =>
        import('lucide-react').then((module) => ({ default: module.Tag })),
      plus: () =>
        import('lucide-react').then((module) => ({ default: module.Plus })),
      edit: () =>
        import('lucide-react').then((module) => ({ default: module.Edit })),
      'trash-2': () =>
        import('lucide-react').then((module) => ({ default: module.Trash2 })),
      eye: () =>
        import('lucide-react').then((module) => ({ default: module.Eye })),
      search: () =>
        import('lucide-react').then((module) => ({ default: module.Search })),
      filter: () =>
        import('lucide-react').then((module) => ({ default: module.Filter })),
      download: () =>
        import('lucide-react').then((module) => ({ default: module.Download })),
      'refresh-cw': () =>
        import('lucide-react').then((module) => ({
          default: module.RefreshCw,
        })),
      'file-text': () =>
        import('lucide-react').then((module) => ({ default: module.FileText })),
      'message-circle': () =>
        import('lucide-react').then((module) => ({
          default: module.MessageCircle,
        })),
      'user-plus': () =>
        import('lucide-react').then((module) => ({ default: module.UserPlus })),
      'user-check': () =>
        import('lucide-react').then((module) => ({
          default: module.UserCheck,
        })),
      'log-out': () =>
        import('lucide-react').then((module) => ({ default: module.LogOut })),
      'layout-dashboard': () =>
        import('lucide-react').then((module) => ({
          default: module.LayoutDashboard,
        })),
      target: () =>
        import('lucide-react').then((module) => ({ default: module.Target })),
    };

    const iconLoader = iconMap[iconName.toLowerCase()];
    if (iconLoader) {
      // تحميل الأيقونة بشكل متزامن
      let IconComponent: ComponentType<any> | null = null;
      iconLoader()
        .then((module) => {
          IconComponent = module.default;
        })
        .catch(() => {
          IconComponent = null;
        });
      return IconComponent;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    return null;
  }
};

const ReliableIcon: React.FC<ReliableIconProps> = ({
  name,
  size = ICON_CONFIG.display.defaultSize,
  className = '',
  color = ICON_CONFIG.display.defaultColor,
  fallback = ICON_CONFIG.loading.fallbackEnabled,
}) => {
  const [IconComponent, setIconComponent] =
    React.useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const loadIcon = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // التحقق من توفر الأيقونة أولاً
        if (!isIconAvailable(name)) {
          throw new Error(`Icon ${name} is not in essential icons list`);
        }

        // تحميل الأيقونة مع مهلة انتظار
        const loadPromise = import('lucide-react');
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Icon loading timeout')),
            ICON_CONFIG.loading.timeout
          )
        );

        const { [name]: Icon } = (await Promise.race([
          loadPromise,
          timeoutPromise,
        ])) as any;

        if (Icon) {
          setIconComponent(() => Icon);
          console.log(`✅ تم تحميل الأيقونة: ${name}`);
        } else {
          throw new Error(`Icon ${name} not found in lucide-react`);
        }
      } catch (error) {
        console.warn(`⚠️ فشل في تحميل الأيقونة ${name}:`, error);
        setHasError(true);
        setIconComponent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcon();
  }, [name]);

  // عرض النظام الاحتياطي أثناء التحميل أو في حالة الخطأ
  if (isLoading || hasError || !IconComponent || fallback) {
    return (
      <IconFallbackFixed
        name={name}
        size={size}
        className={className}
        color={color}
      />
    );
  }

  // عرض الأيقونة من lucide-react
  return <IconComponent size={size} className={className} color={color} />;
};

export default ReliableIcon;
