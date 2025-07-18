import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '@/theme';

interface DashboardNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  to,
  icon,
  label,
  active,
}) => (
  <Link
    to={to}
    className={`
      flex items-center px-4 py-3 rounded-lg
      transition-colors duration-200
      ${
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
      }
      ${theme.fontFamily.arabic}
    `}
  >
    <span className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export const DashboardNav: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      icon: '📊',
      label: 'لوحة التحكم',
    },
    {
      to: '/dashboard/events',
      icon: '📅',
      label: 'الفعاليات',
    },
    {
      to: '/dashboard/programs',
      icon: '🎯',
      label: 'البرامج',
    },
    {
      to: '/dashboard/users',
      icon: '👥',
      label: 'المستخدمين',
    },
    {
      to: '/dashboard/forms',
      icon: '📝',
      label: 'النماذج',
    },
    {
      to: '/dashboard/settings',
      icon: '⚙️',
      label: 'الإعدادات',
    },
  ];

  return (
    <aside className="w-64 bg-white border-l border-neutral-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link to="/dashboard" className="flex items-center">
          <img src="/logo.svg" alt="Shababna" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <DashboardNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={pathname === item.to}
          />
        ))}
      </nav>
    </aside>
  );
};
