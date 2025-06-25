
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from './authCleanupUtils';

function AuthCleanup() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('🧹 [AuthCleanup] Usuário deslogado - executando limpeza');
        cleanupAuthState();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Este componente não renderiza nada - é apenas para executar a lógica de limpeza
  return null;
}

export default AuthCleanup;
