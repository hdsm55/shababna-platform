import React, { Suspense, lazy, memo } from 'react';
import UnifiedLoader from './UnifiedLoader';

// تقسيم الصفحات حسب الأولوية والأداء
interface PageSplitterProps {
  pageType: 'public' | 'dashboard' | 'auth' | 'admin';
  pageName: string;
  fallback?: React.ReactNode;
}

// تقسيم الصفحات العامة - تحميل سريع
const PublicPages = {
  Home: lazy(() => import('../../pages/Home')),
  AboutUs: lazy(() => import('../../pages/AboutUs')),
  Contact: lazy(() => import('../../pages/Contact')),
  JoinUs: lazy(() => import('../../pages/JoinUs')),
  Volunteers: lazy(() => import('../../pages/Volunteers')),
  NotFound: lazy(() => import('../../pages/NotFound')),
};

// تقسيم صفحات المحتوى - تحميل متوسط
const ContentPages = {
  Events: lazy(() => import('../../pages/Events')),
  EventDetail: lazy(() => import('../../pages/EventDetail')),
  EventRegistration: lazy(() => import('../../pages/EventRegistration')),
  Programs: lazy(() => import('../../pages/Programs')),
  ProgramDetail: lazy(() => import('../../pages/ProgramDetail')),
  Blogs: lazy(() => import('../../pages/Blogs')),
  BlogDetail: lazy(() => import('../../pages/BlogDetail')),
  Donations: lazy(() => import('../../pages/Donations')),
};

// تقسيم صفحات المصادقة - تحميل سريع
const AuthPages = {
  Login: lazy(() => import('../../pages/auth/Login')),
  Register: lazy(() => import('../../pages/auth/Register')),
  CreateAdmin: lazy(() => import('../../pages/auth/CreateAdmin')),
};

// تقسيم صفحات لوحة التحكم - تحميل حسب الحاجة
const DashboardPages = {
  Dashboard: lazy(() => import('../../pages/dashboard/Dashboard')),
  Events: lazy(() => import('../../pages/dashboard/Events')),
  Programs: lazy(() => import('../../pages/dashboard/Programs')),
  Blogs: lazy(() => import('../../pages/dashboard/Blogs')),
  Users: lazy(() => import('../../pages/dashboard/Users')),
  Registrants: lazy(() => import('../../pages/dashboard/Registrants')),
  ContactForms: lazy(() => import('../../pages/dashboard/ContactForms')),
  Analytics: lazy(() => import('../../pages/dashboard/Analytics')),
  Activities: lazy(() => import('../../pages/dashboard/Activities')),
  Reports: lazy(() => import('../../pages/dashboard/Reports')),
  Settings: lazy(() => import('../../pages/dashboard/Settings')),
};

// تقسيم صفحات التفاصيل - تحميل منفصل
const DetailPages = {
  EventDetail: lazy(() => import('../../pages/dashboard/events/EventDetail')),
  ProgramDetail: lazy(
    () => import('../../pages/dashboard/programs/ProgramDetail')
  ),
};

// مكون تحميل مخصص لكل نوع صفحة
const PageLoader: React.FC<{ type: string; name: string }> = memo(
  ({ type, name }) => {
    const getLoaderMessage = () => {
      switch (type) {
        case 'public':
          return `جاري تحميل ${name}...`;
        case 'dashboard':
          return `جاري تحميل لوحة التحكم - ${name}...`;
        case 'auth':
          return `جاري تحميل صفحة المصادقة...`;
        case 'content':
          return `جاري تحميل المحتوى - ${name}...`;
        default:
          return `جاري تحميل الصفحة...`;
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <UnifiedLoader type="inline" size="lg" text={getLoaderMessage()} />
        </div>
      </div>
    );
  }
);

PageLoader.displayName = 'PageLoader';

// مكون تقسيم الصفحات الرئيسي
const AdvancedPageSplitter: React.FC<PageSplitterProps> = memo(
  ({ pageType, pageName, fallback }) => {
    const getPageComponent = () => {
      switch (pageType) {
        case 'public':
          return PublicPages[pageName as keyof typeof PublicPages];
        case 'content':
          return ContentPages[pageName as keyof typeof ContentPages];
        case 'auth':
          return AuthPages[pageName as keyof typeof AuthPages];
        case 'dashboard':
          return DashboardPages[pageName as keyof typeof DashboardPages];
        default:
          return PublicPages.NotFound;
      }
    };

    const PageComponent = getPageComponent();

    return (
      <Suspense
        fallback={fallback || <PageLoader type={pageType} name={pageName} />}
      >
        <PageComponent />
      </Suspense>
    );
  }
);

AdvancedPageSplitter.displayName = 'AdvancedPageSplitter';

export default AdvancedPageSplitter;
