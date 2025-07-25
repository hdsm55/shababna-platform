import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  Settings,
  LogOut,
  MessageCircle,
  Activity,
  FileText,
  TrendingUp,
  PieChart,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  UserCheck,
  Mail,
  Database,
  Shield,
  HelpCircle,
  ChevronLeft,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarSections = [
  {
    title: 'dashboard.sidebar.main',
    icon: Home,
    items: [
      {
        key: 'overview',
        path: '/dashboard',
        icon: LayoutDashboard,
        label: 'dashboard.sidebar.overview',
        description: 'dashboard.sidebar.overviewDesc',
      },
    ],
  },
  {
    title: 'dashboard.sidebar.content',
    icon: FileText,
    items: [
      {
        key: 'programs',
        path: '/dashboard/programs',
        icon: BarChart3,
        label: 'dashboard.sidebar.programs',
        description: 'dashboard.sidebar.programsDesc',
      },
      {
        key: 'events',
        path: '/dashboard/events',
        icon: Calendar,
        label: 'dashboard.sidebar.events',
        description: 'dashboard.sidebar.eventsDesc',
      },
      {
        key: 'blogs',
        path: '/dashboard/blogs',
        icon: MessageCircle,
        label: 'dashboard.sidebar.blogs',
        description: 'dashboard.sidebar.blogsDesc',
      },
    ],
  },
  {
    title: 'dashboard.sidebar.users',
    icon: Users,
    items: [
      {
        key: 'registrants',
        path: '/dashboard/registrants',
        icon: UserCheck,
        label: 'dashboard.sidebar.registrants',
        description: 'dashboard.sidebar.registrantsDesc',
      },
      {
        key: 'users',
        path: '/dashboard/users',
        icon: Users,
        label: 'dashboard.sidebar.users',
        description: 'dashboard.sidebar.usersDesc',
      },
    ],
  },
  {
    title: 'dashboard.sidebar.communication',
    icon: Mail,
    items: [
      {
        key: 'contact-forms',
        path: '/dashboard/contact-forms',
        icon: MessageCircle,
        label: 'dashboard.sidebar.contactForms',
        description: 'dashboard.sidebar.contactFormsDesc',
      },
    ],
  },
  {
    title: 'dashboard.sidebar.analytics',
    icon: TrendingUp,
    items: [
      {
        key: 'analytics',
        path: '/dashboard/analytics',
        icon: BarChart3,
        label: 'dashboard.sidebar.analytics',
        description: 'dashboard.sidebar.analyticsDesc',
      },
      {
        key: 'reports',
        path: '/dashboard/reports',
        icon: PieChart,
        label: 'dashboard.sidebar.reports',
        description: 'dashboard.sidebar.reportsDesc',
      },
      {
        key: 'activities',
        path: '/dashboard/activities',
        icon: Activity,
        label: 'dashboard.sidebar.activities',
        description: 'dashboard.sidebar.activitiesDesc',
      },
    ],
  },
  {
    title: 'dashboard.sidebar.system',
    icon: Settings,
    items: [
      {
        key: 'settings',
        path: '/dashboard/settings',
        icon: Settings,
        label: 'dashboard.sidebar.settings',
        description: 'dashboard.sidebar.settingsDesc',
      },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isRTL, language, toggleLanguage } = useLanguageStore();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'dashboard.sidebar.main',
  ]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((title) => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== '/dashboard' && location.pathname.startsWith(path))
    );
  };

  const getActiveSection = () => {
    for (const section of sidebarSections) {
      for (const item of section.items) {
        if (isActive(item.path)) {
          return section.title;
        }
      }
    }
    return 'dashboard.sidebar.main';
  };

  // توسيع القسم النشط تلقائياً
  React.useEffect(() => {
    const activeSection = getActiveSection();
    if (!expandedSections.includes(activeSection)) {
      setExpandedSections((prev) => [...prev, activeSection]);
    }
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-primary-50 ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ width: collapsed ? 80 : 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-screen bg-white border-e border-gray-200 flex flex-col justify-between fixed z-40 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-secondary-500">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-sm">ش</span>
              </div>
              <span className="text-white font-semibold text-lg ms-3">
                {t('dashboard.title', 'لوحة التحكم')}
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-3">
            {sidebarSections.map((section, idx) => {
              const isExpanded = expandedSections.includes(section.title);
              const hasActiveItem = section.items.some((item) =>
                isActive(item.path)
              );

              return (
                <div key={idx} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors group ${
                      hasActiveItem
                        ? 'text-primary-700 bg-primary-50 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <section.icon
                        className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`}
                      />
                      {!collapsed && (
                        <span className="text-xs">
                          {t(
                            section.title,
                            section.title.replace('dashboard.sidebar.', '')
                          )}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isRTL ? (
                          <ChevronLeft className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </motion.div>
                    )}
                  </button>

                  {/* Section Items */}
                  <AnimatePresence>
                    {!collapsed && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 pr-4"
                      >
                        {section.items.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.key}
                              to={item.path}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group relative ${
                                active
                                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600 shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700 hover:translate-x-1'
                              }`}
                            >
                              <item.icon
                                className={`w-4 h-4 ${
                                  isRTL ? 'ml-2' : 'mr-2'
                                } group-hover:scale-110 transition-transform`}
                              />
                              <span className="text-xs">
                                {t(
                                  item.label,
                                  item.label.replace('dashboard.sidebar.', '')
                                )}
                              </span>
                              {active && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute inset-y-0 right-0 w-1 bg-primary-600 rounded-r"
                                  initial={false}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                  }}
                                />
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Actions */}
        <div className="border-t border-gray-200 bg-gray-50">
          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-primary-700 hover:bg-white rounded transition-colors gap-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>{t('dashboard.sidebar.settings', 'الإعدادات')}</span>
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-primary-700 hover:bg-white rounded transition-colors gap-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
                </button>
              </motion.div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className={`w-full mt-3 flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors gap-2 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && (
                <span>{t('dashboard.sidebar.logout', 'تسجيل الخروج')}</span>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ marginLeft: collapsed ? 80 : 280 }}
        animate={{ marginLeft: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 p-6 min-h-screen"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {(() => {
                const activeSection = getActiveSection();
                const section = sidebarSections.find(
                  (s) => s.title === activeSection
                );
                if (section) {
                  const activeItem = section.items.find((item) =>
                    isActive(item.path)
                  );
                  return activeItem
                    ? t(
                        activeItem.label,
                        activeItem.label.replace('dashboard.sidebar.', '')
                      )
                    : t('dashboard.title', 'لوحة التحكم');
                }
                return t('dashboard.title', 'لوحة التحكم');
              })()}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Home className="w-4 h-4" />
              <span>/</span>
              <span>{t('dashboard.breadcrumb', 'لوحة التحكم')}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
