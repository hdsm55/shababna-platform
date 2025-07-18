import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export const useAuthRedirect = (
  redirectTo: string = '/dashboard',
  shouldBeAuthenticated: boolean = true
) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (shouldBeAuthenticated && !isAuthenticated) {
      navigate('/login');
    } else if (!shouldBeAuthenticated && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo, shouldBeAuthenticated]);
};
