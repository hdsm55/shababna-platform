import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from './store/languageStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Programs from './pages/Programs';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const { i18n } = useTranslation();
  const { language, isRTL } = useLanguageStore();

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL, i18n]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Public Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;