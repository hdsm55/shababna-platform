import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'member';
}

function isAllowed(user: any, requiredRole?: string) {
  if (!requiredRole) return true;
  if (requiredRole === 'admin') return !!user?.is_admin;
  if (user?.role === requiredRole || user?.role === 'admin') return true;
  return false;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowed(user, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
