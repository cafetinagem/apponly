
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthCleanup() {
  const cleanupAuthState = useCallback(() => {
    try {
      // Clear all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear from sessionStorage as well
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('❌ [AuthCleanup] Erro na limpeza:', error);
    }
  }, []);

  const performCleanup = useCallback(async () => {
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      // Continue even if signOut fails
      console.warn('⚠️ [AuthCleanup] SignOut falhou, continuando...', error);
    }
  }, [cleanupAuthState]);

  const signOut = useCallback(async () => {
    try {
      await performCleanup();
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('❌ [AuthCleanup] Erro no logout:', error);
      // Force reload anyway
      window.location.href = '/auth';
    }
  }, [performCleanup]);

  return {
    cleanupAuthState,
    performCleanup,
    signOut
  };
}
