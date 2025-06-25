
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSecurity } from './useAuthSecurity';
import { toast } from '@/hooks/use-toast';
import { cleanupAuthState, forceAuthReset } from '@/components/auth/authCleanupUtils';

export function useSecureAuth() {
  const [loading, setLoading] = useState(false);
  const { validatePassword } = useAuthSecurity();

  const secureSignUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const validation = await validatePassword(password);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Senha insegura",
          description: validation.error
        });
        return { error: new Error(validation.error) };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            signup_method: 'secure_password',
            security_validated: true
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message
        });
        return { error };
      }

      toast({
        title: "Cadastro realizado",
        description: "Conta criada com sucesso. Aguarde aprovação."
      });

      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao criar conta';
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorMessage
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, [validatePassword]);

  const secureSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const isAdminLogin = email === 'onlycatbrasil@gmail.com';
      
      await forceAuthReset();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let userFriendlyMessage = error.message;
        
        if (isAdminLogin) {
          if (error.message.includes('Invalid login credentials')) {
            userFriendlyMessage = 'CREDENCIAIS ADMINISTRATIVAS INCORRETAS: Verifique email e senha cadastrados no sistema.';
          } else if (error.message.includes('Email not confirmed')) {
            userFriendlyMessage = 'CONTA ADMINISTRATIVA NÃO CONFIRMADA: Verifique seu email.';
          }
        } else {
          if (error.message.includes('Invalid login credentials')) {
            userFriendlyMessage = 'Email ou senha incorretos';
          } else if (error.message.includes('Email not confirmed')) {
            userFriendlyMessage = 'Email não confirmado';
          }
        }
        
        toast({
          variant: "destructive",
          title: isAdminLogin ? "ERRO ADMINISTRATIVO" : "Erro no login",
          description: userFriendlyMessage
        });
        
        return { error };
      }

      if (!data.user) {
        const errorMsg = 'Dados de usuário não retornados';
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: errorMsg
        });
        return { error: new Error(errorMsg) };
      }

      // Additional security validation for admin accounts
      if (isAdminLogin) {
        console.log('🔐 [SecureAuth] Validando acesso administrativo para:', data.user.email);
        
        // Log admin access for security audit
        await logAdminAccess(data.user.email || '', data.user.id);
      }

      toast({
        title: isAdminLogin ? "ACESSO ADMINISTRATIVO CONCEDIDO" : "Login realizado",
        description: "Redirecionando para página inicial..."
      });
      
      // Aguardar um momento para que o toast seja exibido antes do redirecionamento
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao fazer login';
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: errorMessage
      });
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Security audit logging for admin access
  const logAdminAccess = async (email: string, userId: string) => {
    try {
      await supabase.functions.invoke('log-admin-access', {
        body: {
          email,
          userId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side' // Real IP would be logged server-side
        }
      });
    } catch (error) {
      console.warn('⚠️ [SecureAuth] Failed to log admin access:', error);
      // Don't block login if audit logging fails
    }
  };

  return {
    loading,
    secureSignUp,
    secureSignIn
  };
}
