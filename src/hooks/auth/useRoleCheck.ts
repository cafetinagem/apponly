
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useRoleCheck(user: User | null) {
  const [isApproved, setIsApproved] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsApproved(false);
        setUserRole(null);
        setRoleLoading(false);
        return;
      }

      // ADMIN PRIORITY: Aprovação imediata para admin
      if (user.email === 'onlycatbrasil@gmail.com') {
        setIsApproved(true);
        setUserRole('admin');
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('status_conta, role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ [RoleCheck] Erro ao verificar perfil:', error);
          setIsApproved(false);
          setUserRole(null);
        } else if (data) {
          setIsApproved(data.status_conta === 'aprovado');
          setUserRole(data.role);
        } else {
          setIsApproved(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('❌ [RoleCheck] Erro inesperado:', error);
        setIsApproved(false);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    checkUserRole();
  }, [user?.id, user?.email]);

  return {
    isApproved,
    userRole,
    roleLoading,
    isAdmin: user?.email === 'onlycatbrasil@gmail.com' || userRole === 'admin',
    isExecutor: userRole === 'executor',
    isModelo: userRole === 'modelo'
  };
}
