
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useUserRole() {
  const { user } = useAuth();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // PRIORITY: Admin check direto por email primeiro
      if (user.email === 'onlycatbrasil@gmail.com') {
        console.log('👑 [UserRole] USUÁRIO ADMINISTRATIVO DETECTADO - Retornando perfil admin direto');
        return {
          role: 'admin' as const,
          status_conta: 'aprovado' as const,
          user_id: user.id,
          email: user.email
        };
      }

      // Para outros usuários, buscar no banco
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, status_conta')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ [UserRole] Erro ao carregar perfil:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
    refetchOnWindowFocus: false
  });

  // ADMIN PRIORITY: Verificação direta por email sempre tem prioridade
  const isAdmin = user?.email === 'onlycatbrasil@gmail.com' || userProfile?.role === 'admin';
  const isExecutor = userProfile?.role === 'executor';
  const isModelo = userProfile?.role === 'modelo';
  const isApproved = user?.email === 'onlycatbrasil@gmail.com' || userProfile?.status_conta === 'aprovado';

  console.log('🔐 [UserRole] Status atual:', {
    userEmail: user?.email,
    isAdmin,
    userProfileRole: userProfile?.role,
    isApproved,
    loading: isLoading
  });

  return {
    userProfile,
    isAdmin,
    isExecutor,
    isModelo,
    isApproved,
    loading: isLoading
  };
}
