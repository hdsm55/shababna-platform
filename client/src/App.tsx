import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from './store/languageStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastProvider } from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardOverview from './pages/dashboard/Dashboard';
import ProgramsDashboard from './pages/dashboard/Programs';
import EventsDashboard from './pages/dashboard/Events';
import NewEvent from './pages/dashboard/events/NewEvent';
import NewProgram from './pages/dashboard/programs/NewProgram';
import NewUser from './pages/dashboard/users/NewUser';
import ContactForms from './pages/dashboard/ContactForms';
import RegistrantsDashboard from './pages/dashboard/Registrants';
import EditEvent from './pages/dashboard/events/EditEvent';
import DashboardEventDetail from './pages/dashboard/events/EventDetail';
import DashboardProgramDetail from './pages/dashboard/programs/ProgramDetail';
import EditProgram from './pages/dashboard/programs/EditProgram';
import NotFound from './pages/NotFound';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import BlogsDashboard from './pages/dashboard/Blogs';
import UsersDashboard from './pages/dashboard/Users';
import SettingsDashboard from './pages/dashboard/Settings';
import ReportsDashboard from './pages/dashboard/Reports';
import AnalyticsDashboard from './pages/dashboard/Analytics';
import ActivitiesDashboard from './pages/dashboard/Activities';

function App() {
  const { i18n } = useTranslation();
  const { language, isRTL } = useLanguageStore();

  // ضبط اتجاه الصفحة ولغة html بشكل مركزي واحترافي
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute requiredRole="user">
                    <Routes>
                      <Route path="" element={<DashboardOverview />} />
                      <Route path="programs" element={<ProgramsDashboard />} />
                      <Route path="events" element={<EventsDashboard />} />
                      <Route path="contact-forms" element={<ContactForms />} />
                      <Route path="forms" element={<ContactForms />} />
                      <Route
                        path="registrants"
                        element={<RegistrantsDashboard />}
                      />
                      <Route path="blogs" element={<BlogsDashboard />} />
                      <Route path="users" element={<UsersDashboard />} />
                      <Route path="settings" element={<SettingsDashboard />} />
                      <Route path="reports" element={<ReportsDashboard />} />
                      <Route
                        path="analytics"
                        element={<AnalyticsDashboard />}
                      />
                      <Route
                        path="activities"
                        element={<ActivitiesDashboard />}
                      />
                      {/* صفحات الإجراءات السريعة */}
                      <Route path="events/new" element={<NewEvent />} />
                      <Route path="programs/new" element={<NewProgram />} />
                      <Route path="users/new" element={<NewUser />} />
                      <Route path="events/:id/edit" element={<EditEvent />} />
                      <Route
                        path="events/:id"
                        element={<DashboardEventDetail />}
                      />
                      <Route
                        path="programs/:id"
                        element={<DashboardProgramDetail />}
                      />
                      <Route
                        path="programs/:id/edit"
                        element={<EditProgram />}
                      />
                      {/* يمكن إضافة فروع أخرى هنا لاحقًا */}
                    </Routes>
                  </ProtectedRoute>
                }
              />

              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:id" element={<EventDetail />} />
                      <Route path="/programs" element={<Programs />} />
                      <Route path="/programs/:id" element={<ProgramDetail />} />
                      <Route path="/join-us" element={<JoinUs />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blogs" element={<Blogs />} />
                      <Route path="/blogs/:id" element={<BlogDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
