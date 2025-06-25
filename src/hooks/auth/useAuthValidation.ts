
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAuthValidation() {
  const [validating, setValidating] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    setValidating(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [AuthValidation] Erro no login:', error);
        return { error };
      }

      if (!data.user) {
        const errorMsg = 'Dados de usuário não retornados';
        return { error: new Error(errorMsg) };
      }

      console.log('✅ [AuthValidation] Login validado:', data.user.email);
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao fazer login';
      console.error('❌ [AuthValidation] Erro inesperado:', err);
      return { error: new Error(errorMessage) };
    } finally {
      setValidating(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setValidating(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            signup_method: 'standard',
            security_validated: true
          }
        }
      });

      if (error) {
        console.error('❌ [AuthValidation] Erro no cadastro:', error);
        return { error };
      }

      console.log('✅ [AuthValidation] Cadastro validado para:', email);
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao criar conta';
      console.error('❌ [AuthValidation] Erro inesperado:', err);
      return { error: new Error(errorMessage) };
    } finally {
      setValidating(false);
    }
  }, []);

  return {
    validating,
    signIn,
    signUp
  };
}
