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
import PageLoader from './components/common/PageLoader';
import AppLoader from './components/common/AppLoader';
import PageTransitionLoader from './components/common/PageTransitionLoader';
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

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 minutes - increased for better caching
      retry: (failureCount, error: any) => {
        // Retry up to 2 times for network errors or 5xx errors
        if (failureCount < 2) {
          if (error?.response?.status >= 500) return true;
          if (error?.code === 'ECONNABORTED') return true;
          if (error?.message?.includes('timeout')) return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection time
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // تحسين الأداء
      refetchInterval: false,
      refetchIntervalInBackground: false,
      // تحسين الأداء الإضافي
      networkMode: 'online',
      structuralSharing: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

function App() {
  useEffect(() => {
    // بدء مراقبة الأداء
    startPerformanceMonitoring();
  }, []);

  return (
    <PerformanceOptimizer>
      <FontOptimizer>
        <CacheOptimizer>
          <AppLoader>
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
                                  <Suspense
                                    fallback={
                                      <PageLoader
                                        message="جاري تحميل الصفحة الرئيسية..."
                                        variant="default"
                                        showProgress={true}
                                        size="medium"
                                        theme="light"
                                      />
                                    }
                                  >
                                    <Home />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/about"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة من نحن..." />
                                    }
                                  >
                                    <AboutUs />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/events"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل الفعاليات..." />
                                    }
                                  >
                                    <Events />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/events/:id"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل تفاصيل الفعالية..." />
                                    }
                                  >
                                    <EventDetail />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/events/:id/register"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة التسجيل..." />
                                    }
                                  >
                                    <EventRegistration />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/programs"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل البرامج..." />
                                    }
                                  >
                                    <Programs />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/programs/:id"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل تفاصيل البرنامج..." />
                                    }
                                  >
                                    <ProgramDetail />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/blogs"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل المدونة..." />
                                    }
                                  >
                                    <Blogs />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/blogs/:id"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل المقال..." />
                                    }
                                  >
                                    <BlogDetail />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/contact"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة التواصل..." />
                                    }
                                  >
                                    <Contact />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/donations"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة التبرعات..." />
                                    }
                                  >
                                    <Donations />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/join-us"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة الانضمام..." />
                                    }
                                  >
                                    <JoinUs />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="/volunteers"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل صفحة المتطوعين..." />
                                    }
                                  >
                                    <Volunteers />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="*"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل الصفحة..." />
                                    }
                                  >
                                    <NotFound />
                                  </Suspense>
                                }
                              />
                            </Route>

                            {/* Auth Routes */}
                            <Route
                              path="/login"
                              element={
                                <Suspense
                                  fallback={
                                    <PageLoader message="جاري تحميل صفحة تسجيل الدخول..." />
                                  }
                                >
                                  <Login />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/register"
                              element={
                                <Suspense
                                  fallback={
                                    <PageLoader message="جاري تحميل صفحة التسجيل..." />
                                  }
                                >
                                  <Register />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/create-admin"
                              element={
                                <Suspense
                                  fallback={
                                    <PageLoader message="جاري تحميل صفحة إنشاء المدير..." />
                                  }
                                >
                                  <CreateAdmin />
                                </Suspense>
                              }
                            />

                            {/* Dashboard Routes - منفصلة عن Layout العام */}
                            <Route
                              path="/dashboard"
                              element={<DashboardLayout />}
                            >
                              <Route
                                index
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل لوحة التحكم..." />
                                    }
                                  >
                                    <Dashboard />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="events"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل إدارة الفعاليات..." />
                                    }
                                  >
                                    <DashboardEvents />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="programs"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل إدارة البرامج..." />
                                    }
                                  >
                                    <DashboardPrograms />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="blogs"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل إدارة المدونة..." />
                                    }
                                  >
                                    <DashboardBlogs />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="users"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل إدارة المستخدمين..." />
                                    }
                                  >
                                    <DashboardUsers />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="registrants"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل قائمة المسجلين..." />
                                    }
                                  >
                                    <DashboardRegistrants />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="contact-forms"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل رسائل التواصل..." />
                                    }
                                  >
                                    <DashboardContactForms />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="analytics"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل التحليلات..." />
                                    }
                                  >
                                    <DashboardAnalytics />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="activities"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل النشاطات..." />
                                    }
                                  >
                                    <DashboardActivities />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="reports"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل التقارير..." />
                                    }
                                  >
                                    <DashboardReports />
                                  </Suspense>
                                }
                              />
                              <Route
                                path="settings"
                                element={
                                  <Suspense
                                    fallback={
                                      <PageLoader message="جاري تحميل الإعدادات..." />
                                    }
                                  >
                                    <DashboardSettings />
                                  </Suspense>
                                }
                              />
                            </Route>

                            {/* Catch-all route for 404 */}
                            <Route
                              path="*"
                              element={
                                <Suspense
                                  fallback={
                                    <PageLoader message="جاري تحميل الصفحة..." />
                                  }
                                >
                                  <NotFound />
                                </Suspense>
                              }
                            />
                          </Routes>
                        </HashRouter>
                      </BackendIdleHandler>
                    </ToastProvider>
                  </ThemeProvider>
                </QueryClientProvider>
              </HelmetProvider>
            </ErrorBoundary>
          </AppLoader>
        </CacheOptimizer>
      </FontOptimizer>
    </PerformanceOptimizer>
  );
}

export default App;
