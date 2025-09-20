import React, { useState, useEffect } from 'react';
import IconFallback from './IconFallback';

interface SafeIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  fallback?: boolean;
}

const SafeIcon: React.FC<SafeIconProps> = ({
  name,
  size = 24,
  className = '',
  color = 'currentColor',
  fallback = true,
}) => {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        // محاولة تحميل الأيقونة من lucide-react
        const { [name]: Icon } = await import('lucide-react');
        if (Icon) {
          setIconComponent(() => Icon);
          setHasError(false);
        } else {
          throw new Error(`Icon ${name} not found`);
        }
      } catch (error) {
        console.warn(`Failed to load icon ${name}:`, error);
        setHasError(true);
      }
    };

    loadIcon();
  }, [name]);

  // إذا فشل تحميل الأيقونة أو تم تفعيل النظام الاحتياطي
  if (hasError || !IconComponent || fallback) {
    return (
      <IconFallback
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

export default SafeIcon;
