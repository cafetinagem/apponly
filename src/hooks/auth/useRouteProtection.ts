
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface UseRouteProtectionProps {
  user: User | null;
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
}

export function useRouteProtection({ user, loading, isApproved, isAdmin }: UseRouteProtectionProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    const isAuthPage = currentPath === '/auth';
    const isAdminPage = currentPath.startsWith('/admin');

    // Redirect logic
    if (!user && !isAuthPage) {
      navigate('/auth', { replace: true });
    } else if (user && isAuthPage && isApproved) {
      // Usuário logado e aprovado na página de auth - redirecionar para início
      if (isAdmin) {
        navigate('/', { replace: true }); // Admin também vai para página inicial
      } else {
        navigate('/', { replace: true }); // Usuário comum vai para página inicial
      }
    } else if (user && !isApproved && !isAuthPage) {
      // User not approved, redirect to auth with message
      navigate('/auth', { replace: true });
    } else if (user && isAdminPage && !isAdmin) {
      // Non-admin trying to access admin area
      navigate('/', { replace: true });
    }
  }, [user, loading, isApproved, isAdmin, location.pathname, navigate]);
}
