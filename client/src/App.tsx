import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import BackendIdleHandler from './components/common/BackendIdleHandler';
import { ToastProvider } from './components/common/Toast';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/layout/Layout';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PerformanceOptimizer from './components/common/PerformanceOptimizer';
import FontOptimizer from './components/common/FontOptimizer';
import CacheOptimizer from './components/common/CacheOptimizer';
import { startPerformanceMonitoring } from './utils/web-vitals';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventRegistration = lazy(() => import('./pages/EventRegistration'));
const Programs = lazy(() => import('./pages/Programs'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Donations = lazy(() => import('./pages/Donations'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const Volunteers = lazy(() => import('./pages/Volunteers'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const CreateAdmin = lazy(() => import('./pages/auth/CreateAdmin'));

// Dashboard Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const DashboardEvents = lazy(() => import('./pages/dashboard/Events'));
const DashboardPrograms = lazy(() => import('./pages/dashboard/Programs'));
const DashboardBlogs = lazy(() => import('./pages/dashboard/Blogs'));
const DashboardUsers = lazy(() => import('./pages/dashboard/Users'));
const DashboardRegistrants = lazy(
  () => import('./pages/dashboard/Registrants')
);
const DashboardContactForms = lazy(
  () => import('./pages/dashboard/ContactForms')
);
const DashboardAnalytics = lazy(() => import('./pages/dashboard/Analytics'));
const DashboardActivities = lazy(() => import('./pages/dashboard/Activities'));
const DashboardReports = lazy(() => import('./pages/dashboard/Reports'));
const DashboardSettings = lazy(() => import('./pages/dashboard/Settings'));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <LoadingSpinner />
  </div>
);

function App() {
  useEffect(() => {
    // Start performance monitoring
    startPerformanceMonitoring();
  }, []);

  return (
    <PerformanceOptimizer>
      <FontOptimizer>
        <CacheOptimizer>
          <ErrorBoundary>
            <HelmetProvider>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                  <ToastProvider>
                    <BackendIdleHandler>
                      <HashRouter
                        future={{
                          v7_startTransition: true,
                          v7_relativeSplatPath: true,
                        }}
                      >
                        <Routes>
                          {/* Public Routes داخل Layout */}
                          <Route element={<Layout />}>
                            <Route
                              path="/"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Home />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/about"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <AboutUs />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/events"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Events />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/events/:id"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <EventDetail />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/events/:id/register"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <EventRegistration />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/programs"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Programs />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/programs/:id"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <ProgramDetail />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/blogs"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Blogs />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/blogs/:id"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <BlogDetail />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/contact"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Contact />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/donations"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Donations />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/join-us"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <JoinUs />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/volunteers"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <Volunteers />
                                </Suspense>
                              }
                            />
                            <Route
                              path="*"
                              element={
                                <Suspense fallback={<LoadingFallback />}>
                                  <NotFound />
                                </Suspense>
                              }
                            />
                          </Route>

                          {/* Auth Routes */}
                          <Route
                            path="/login"
                            element={
                              <Suspense fallback={<LoadingFallback />}>
                                <Login />
                              </Suspense>
                            }
                          />
                          <Route
                            path="/register"
                            element={
                              <Suspense fallback={<LoadingFallback />}>
                                <Register />
                              </Suspense>
                            }
                          />
                          <Route
                            path="/create-admin"
                            element={
                              <Suspense fallback={<LoadingFallback />}>
                                <CreateAdmin />
                              </Suspense>
                            }
                          />

                          {/* Dashboard Routes */}
                          <Route element={<DashboardLayout />}>
                            <Route
                              index
                              path="/dashboard"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <Dashboard />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/events"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardEvents />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/programs"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardPrograms />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/blogs"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardBlogs />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/users"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardUsers />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/registrants"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardRegistrants />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/contact-forms"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardContactForms />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/analytics"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardAnalytics />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/activities"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardActivities />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/reports"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardReports />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/dashboard/settings"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <Suspense fallback={<LoadingFallback />}>
                                    <DashboardSettings />
                                  </Suspense>
                                </ProtectedRoute>
                              }
                            />
                          </Route>
                        </Routes>
                      </HashRouter>
                    </BackendIdleHandler>
                  </ToastProvider>
                </ThemeProvider>
              </QueryClientProvider>
            </HelmetProvider>
          </ErrorBoundary>
        </CacheOptimizer>
      </FontOptimizer>
    </PerformanceOptimizer>
  );
}

export default App;
