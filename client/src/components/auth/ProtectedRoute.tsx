import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'admin',
  fallbackPath = '/',
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // إذا كان المستخدم مسجل دخول ولكن ليس لديه الصلاحية المطلوبة
  if (requiredRole === 'admin' && user.role !== 'admin') {
    // إظهار رسالة تنبيه قبل التوجيه
    console.log('🚫 محاولة وصول غير مصرح بها للداشبورد من مستخدم عادي');
    return <Navigate to={fallbackPath} replace />;
  }

  // إذا كان المستخدم لديه الصلاحية المطلوبة
  return <>{children}</>;
};

export default ProtectedRoute;
