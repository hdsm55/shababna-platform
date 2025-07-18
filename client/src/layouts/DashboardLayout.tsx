import React from 'react';
import MainNav from '../components/common/MainNav';
import Footer from '../components/common/Footer';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const dashboardLinks = [
  { to: '/dashboard', label: 'الرئيسية' },
  { to: '/dashboard/events', label: 'الفعاليات' },
  { to: '/dashboard/programs', label: 'البرامج' },
  { to: '/dashboard/users', label: 'المستخدمون' },
  { to: '/dashboard/reports', label: 'التقارير' },
  { to: '/dashboard/settings', label: 'الإعدادات' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="auto">
      <MainNav />
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* الشريط الجانبي */}
        <aside className="hidden md:flex flex-col gap-2 w-56 shrink-0 pt-4">
          <nav className="flex flex-col gap-1">
            {dashboardLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* المحتوى */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
