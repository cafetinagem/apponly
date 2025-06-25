
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthCore() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const checkUserApproval = async (userId: string) => {
    try {
      console.log('✅ [AuthCore] Verificando aprovação para usuário:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('status_conta')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ [AuthCore] Erro ao verificar aprovação:', error);
        setIsApproved(false);
        return;
      }

      if (!data) {
        console.log('⚠️ [AuthCore] Perfil não encontrado, pendente por padrão');
        setIsApproved(false);
        return;
      }

      const approved = data.status_conta === 'aprovado';
      console.log('🔒 [AuthCore] Status de aprovação:', data.status_conta, '- Aprovado:', approved);
      setIsApproved(approved);
    } catch (err) {
      console.error('❌ [AuthCore] Erro inesperado na verificação:', err);
      setIsApproved(false);
    }
  };

  const initializeSession = async () => {
    try {
      console.log('🔍 [AuthCore] Verificando sessão existente...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [AuthCore] Erro ao obter sessão:', error);
        setLoading(false);
        return;
      }

      console.log('📋 [AuthCore] Sessão obtida:', session?.user?.email || 'nenhuma');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userEmail = session.user.email;
        
        // ADMIN PRIORITY: Aprovação imediata para admin
        if (userEmail === 'onlycatbrasil@gmail.com') {
          console.log('👑 [AuthCore] SESSÃO ADMINISTRATIVA ENCONTRADA - Aprovação imediata');
          setIsApproved(true);
        } else {
          console.log('👤 [AuthCore] Verificando aprovação para usuário regular');
          await checkUserApproval(session.user.id);
        }
      } else {
        setIsApproved(false);
      }
    } catch (error) {
      console.error('❌ [AuthCore] Erro na inicialização:', error);
      setIsApproved(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    isApproved,
    setUser,
    setSession,
    setLoading,
    setIsApproved,
    checkUserApproval,
    initializeSession
  };
}
