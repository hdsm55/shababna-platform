import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarSections = [
  {
    title: 'الرئيسية',
    items: [
      {
        key: 'overview',
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'نظرة عامة',
      },
    ],
  },
  {
    title: 'إدارة المحتوى',
    items: [
      {
        key: 'programs',
        path: '/dashboard/programs',
        icon: BarChart3,
        label: 'البرامج',
      },
      {
        key: 'events',
        path: '/dashboard/events',
        icon: Calendar,
        label: 'الفعاليات',
      },
      {
        key: 'donations',
        path: '/dashboard/donations',
        icon: DollarSign,
        label: 'التبرعات',
      },
      {
        key: 'registrants',
        path: '/dashboard/registrants',
        icon: Users,
        label: 'المسجلون',
      },
      {
        key: 'users',
        path: '/dashboard/users',
        icon: Users,
        label: 'المستخدمون',
      },
      {
        key: 'contact-forms',
        path: '/dashboard/contact-forms',
        icon: MessageCircle,
        label: 'رسائل التواصل',
      },
    ],
  },
  {
    title: 'الإعدادات',
    items: [
      {
        key: 'settings',
        path: '/dashboard/settings',
        icon: Settings,
        label: 'الإعدادات',
      },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isRTL } = useLanguageStore();

  return (
    <div
      className={`min-h-screen flex bg-gray-50 ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border-e border-gray-200 flex flex-col justify-between fixed z-40">
        <div>
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 ms-3">
              Dashboard
            </span>
          </div>
          <nav className="mt-6 px-3">
            <div className="space-y-6">
              {sidebarSections.map((section, idx) => (
                <div key={idx}>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-2 tracking-widest">
                    {section.title}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive =
                        location.pathname === item.path ||
                        (item.path !== '/dashboard' &&
                          location.pathname.startsWith(item.path));
                      return (
                        <Link
                          key={item.key}
                          to={item.path}
                          className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors group
                            ${
                              isActive
                                ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                            }
                          `}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isRTL ? 'ml-3' : 'mr-3'
                            } group-hover:scale-110 transition-transform`}
                          />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
        {/* User info and settings */}
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
              {user?.first_name?.charAt(0) || 'J'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Link
              to="/dashboard/settings"
              className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded transition-colors gap-1"
            >
              <Settings className="w-4 h-4" />
              <span>الإعدادات</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-error-600 hover:bg-error-50 rounded transition-colors gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <main className={`flex-1 ms-64 p-4 bg-gray-50 min-h-screen`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
