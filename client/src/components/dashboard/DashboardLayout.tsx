import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isRTL } = useLanguageStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      key: 'overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard.menu.overview'),
    },
    {
      key: 'events',
      path: '/dashboard/events',
      icon: Calendar,
      label: t('dashboard.menu.events'),
    },
    {
      key: 'programs',
      path: '/dashboard/programs',
      icon: BarChart3,
      label: t('dashboard.menu.programs'),
    },
    {
      key: 'users',
      path: '/dashboard/users',
      icon: Users,
      label: t('dashboard.menu.users'),
    },
    {
      key: 'donations',
      path: '/dashboard/donations',
      icon: DollarSign,
      label: t('dashboard.menu.donations'),
    },
    {
      key: 'settings',
      path: '/dashboard/settings',
      icon: Settings,
      label: t('dashboard.menu.settings'),
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {user?.firstName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:${isRTL ? 'mr-64' : 'ml-64'}`}>
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;