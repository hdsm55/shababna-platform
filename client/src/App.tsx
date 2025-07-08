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
import Donations from './pages/Donations';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardOverview from './pages/dashboard/Dashboard';
import ProgramsDashboard from './pages/dashboard/Programs';
import EventsDashboard from './pages/dashboard/Events';

function App() {
  const { i18n } = useTranslation();
  const { language, isRTL } = useLanguageStore();

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL, i18n]);

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
                  <ProtectedRoute requiredRole="admin">
                    <Routes>
                      <Route path="" element={<DashboardOverview />} />
                      <Route path="programs" element={<ProgramsDashboard />} />
                      <Route path="events" element={<EventsDashboard />} />
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
                      <Route path="/donations" element={<Donations />} />
                      <Route path="/join-us" element={<JoinUs />} />
                      <Route path="/contact" element={<Contact />} />
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
