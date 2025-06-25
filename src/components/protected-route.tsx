import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ApprovalStatus } from '@/components/auth/ApprovalStatus';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isApproved, isAdmin } = useAuth();

  // Loading otimizado - apenas spinner simples
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-600 border-t-transparent"></div>
      </div>
    );
  }

  // Se não há usuário, redirecionar para auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin tem acesso direto (bypass approval)
  if (user.email === 'onlycatbrasil@gmail.com' || isAdmin) {
    return <>{children}</>;
  }

  // Se usuário está logado mas não aprovado, mostrar tela de aprovação
  if (!isApproved) {
    return <ApprovalStatus />;
  }

  // Usuário aprovado - mostrar conteúdo
  return <>{children}</>;
}
