import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/layout/Layout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventRegistration from './pages/EventRegistration';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Donations from './pages/Donations';
import JoinUs from './pages/JoinUs';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateAdmin from './pages/auth/CreateAdmin';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import DashboardEvents from './pages/dashboard/Events';
import DashboardPrograms from './pages/dashboard/Programs';
import DashboardBlogs from './pages/dashboard/Blogs';
import DashboardUsers from './pages/dashboard/Users';
import DashboardRegistrants from './pages/dashboard/Registrants';
import DashboardContactForms from './pages/dashboard/ContactForms';
import DashboardAnalytics from './pages/dashboard/Analytics';
import DashboardActivities from './pages/dashboard/Activities';
import DashboardReports from './pages/dashboard/Reports';
import DashboardSettings from './pages/dashboard/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
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
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route
                      path="/events/:id/register"
                      element={<EventRegistration />}
                    />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/programs/:id" element={<ProgramDetail />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/:id" element={<BlogDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donations" element={<Donations />} />
                    <Route path="/join-us" element={<JoinUs />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/create-admin" element={<CreateAdmin />} />

                  {/* Dashboard Routes - منفصلة عن Layout العام */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="events" element={<DashboardEvents />} />
                    <Route path="programs" element={<DashboardPrograms />} />
                    <Route path="blogs" element={<DashboardBlogs />} />
                    <Route path="users" element={<DashboardUsers />} />
                    <Route
                      path="registrants"
                      element={<DashboardRegistrants />}
                    />
                    <Route
                      path="contact-forms"
                      element={<DashboardContactForms />}
                    />
                    <Route path="analytics" element={<DashboardAnalytics />} />
                    <Route
                      path="activities"
                      element={<DashboardActivities />}
                    />
                    <Route path="reports" element={<DashboardReports />} />
                    <Route path="settings" element={<DashboardSettings />} />
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
