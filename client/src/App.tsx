import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/layout/Layout';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
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

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      retry: 1,
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      gcTime: 15 * 60 * 1000, // 15 minutes garbage collection time
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <BrowserRouter
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
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Home />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/events"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Events />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/events/:id"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <EventDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/events/:id/register"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <EventRegistration />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/programs"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Programs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/programs/:id"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <ProgramDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/blogs"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Blogs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/blogs/:id"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <BlogDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Contact />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/donations"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Donations />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/join-us"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <JoinUs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/volunteers"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Volunteers />
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <NotFound />
                        </Suspense>
                      }
                    />
                  </Route>

                  {/* Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <Register />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/create-admin"
                    element={
                      <Suspense fallback={<LoadingSpinner size="lg" />}>
                        <CreateAdmin />
                      </Suspense>
                    }
                  />

                  {/* Dashboard Routes - منفصلة عن Layout العام */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route
                      index
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <Dashboard />
                        </Suspense>
                      }
                    />
                    <Route
                      path="events"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardEvents />
                        </Suspense>
                      }
                    />
                    <Route
                      path="programs"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardPrograms />
                        </Suspense>
                      }
                    />
                    <Route
                      path="blogs"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardBlogs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="users"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardUsers />
                        </Suspense>
                      }
                    />
                    <Route
                      path="registrants"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardRegistrants />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contact-forms"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardContactForms />
                        </Suspense>
                      }
                    />
                    <Route
                      path="analytics"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardAnalytics />
                        </Suspense>
                      }
                    />
                    <Route
                      path="activities"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardActivities />
                        </Suspense>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardReports />
                        </Suspense>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <Suspense fallback={<LoadingSpinner size="lg" />}>
                          <DashboardSettings />
                        </Suspense>
                      }
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
