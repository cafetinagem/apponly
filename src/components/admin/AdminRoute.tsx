
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  console.log('🛡️ [AdminRoute] Verificação de acesso:', {
    userEmail: user?.email,
    isAdmin,
    authLoading,
    roleLoading
  });

  // Security audit logging for admin page access attempts
  useEffect(() => {
    if (!authLoading && !roleLoading && user) {
      const isAdminUser = user?.email === 'onlycatbrasil@gmail.com' || isAdmin;
      
      if (!isAdminUser) {
        console.warn('🚨 [AdminRoute] TENTATIVA DE ACESSO NÃO AUTORIZADO:', {
          userEmail: user.email,
          userId: user.id,
          timestamp: new Date().toISOString()
        });
        
        // Log unauthorized access attempt
        logUnauthorizedAccess(user.email || '', user.id);
      }
    }
  }, [user, isAdmin, authLoading, roleLoading]);

  const logUnauthorizedAccess = async (email: string, userId: string) => {
    try {
      await fetch('/api/security/unauthorized-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userId,
          attemptedResource: 'admin-panel',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.warn('⚠️ [AdminRoute] Failed to log unauthorized access:', error);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // ADMIN PRIORITY: Verificação direta por email
  const isAdminUser = user?.email === 'onlycatbrasil@gmail.com' || isAdmin;

  if (!isAdminUser) {
    console.log('🚫 [AdminRoute] Acesso negado para:', user?.email);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            🔒 Acesso negado. Esta página é restrita apenas para administradores autorizados.
            Tentativas de acesso não autorizado são registradas por motivos de segurança.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  console.log('✅ [AdminRoute] Acesso administrativo CONCEDIDO para:', user?.email);
  return <>{children}</>;
}
