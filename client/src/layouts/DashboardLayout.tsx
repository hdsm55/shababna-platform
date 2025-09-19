import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { theme } from '../theme';
import ScrollToTop from '../components/common/ScrollToTop';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  Bell,
  UserCheck,
  MessageCircle,
  UserPlus,
} from 'lucide-react';

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
      flex items-center px-3 py-2 rounded-lg
      transition-colors duration-200
      ${
        active
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
      font-['Tajawal',_sans-serif]
    `}
  >
    <span className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  // التأكد من التمرير للأعلى عند تغيير الصفحة في لوحة التحكم
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // التأكد من التمرير للأعلى حتى لو كان هناك تأخير في التحميل
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const navItems = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: 'لوحة التحكم الرئيسية',
    },
    {
      to: '/dashboard/events',
      icon: <Calendar className="w-4 h-4" />,
      label: 'إدارة الفعاليات',
    },
    {
      to: '/dashboard/programs',
      icon: <Target className="w-4 h-4" />,
      label: 'إدارة البرامج',
    },
    {
      to: '/dashboard/users',
      icon: <Users className="w-4 h-4" />,
      label: 'إدارة المستخدمين',
    },
    {
      to: '/dashboard/registrants',
      icon: <UserPlus className="w-4 h-4" />,
      label: 'المسجلون',
    },
    {
      to: '/dashboard/blogs',
      icon: <FileText className="w-4 h-4" />,
      label: 'إدارة المقالات',
    },
    {
      to: '/dashboard/contact-forms',
      icon: <MessageCircle className="w-4 h-4" />,
      label: 'رسائل التواصل',
    },
    {
      to: '/dashboard/join-requests',
      icon: <UserPlus className="w-4 h-4" />,
      label: 'طلبات الانضمام',
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50" dir="auto">
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2">
              <img
                src="/images/logo.jpg"
                alt="شعار شبابنا"
                className="w-8 h-8 object-contain rounded-lg"
              />
            </div>
            <span className="text-lg font-bold text-gray-900">شبابنا</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item, index) => (
            <DashboardNavItem
              key={`nav-${index}-${item.to}`}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={pathname === item.to}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.first_name || user?.email || 'مستخدم'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin'
                    ? 'مدير'
                    : user?.role === 'user'
                    ? 'مستخدم'
                    : 'عضو'}
                </p>
              </div>
            </div>
            <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6">{children || <Outlet />}</main>
    </div>
  );
};

export default DashboardLayout;
