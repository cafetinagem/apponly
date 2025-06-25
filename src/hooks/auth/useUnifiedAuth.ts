import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  userRole: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

export function useUnifiedAuth() {
  const [state, setState] = useState<UnifiedAuthState>({
    user: null,
    session: null,
    loading: true,
    isApproved: false,
    isAdmin: false,
    userRole: null,
    connectionStatus: 'disconnected'
  });

  const initializedRef = useRef(false);

  // Função otimizada para atualizar estado
  const updateAuthState = useCallback(async (session: Session | null) => {
    const user = session?.user || null;
    
    if (!user) {
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
        isApproved: false,
        isAdmin: false,
        userRole: null
      }));
      return;
    }

    // Admin direto - sem delay
    if (user.email === 'onlycatbrasil@gmail.com') {
      setState(prev => ({
        ...prev,
        user,
        session,
        loading: false,
        isApproved: true,
        isAdmin: true,
        userRole: 'admin',
        connectionStatus: 'connected'
      }));
      return;
    }

    // Verificar perfil regular com timeout reduzido
    try {
      const { data: profile, error } = await Promise.race([
        supabase
          .from('user_profiles')
          .select('status_conta, role')
          .eq('user_id', user.id)
          .maybeSingle(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000) // Reduzido para 2s
        )
      ]) as any;

      if (error) {
        // Fallback rápido
        setState(prev => ({
          ...prev,
          user,
          session,
          loading: false,
          isApproved: false,
          isAdmin: false,
          userRole: null,
          connectionStatus: 'connected'
        }));
        return;
      }

      const isApproved = profile?.status_conta === 'aprovado';
      const isAdmin = profile?.role === 'admin';
      const userRole = profile?.role || null;

      setState(prev => ({
        ...prev,
        user,
        session,
        loading: false,
        isApproved,
        isAdmin,
        userRole,
        connectionStatus: 'connected'
      }));
    } catch (error) {
      // Fallback instantâneo
      setState(prev => ({
        ...prev,
        user,
        session,
        loading: false,
        isApproved: false,
        isAdmin: false,
        userRole: null,
        connectionStatus: 'connected'
      }));
    }
  }, []);

  // Inicialização otimizada
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      try {
        // Timeout reduzido para 3 segundos
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth timeout')), 3000)
          )
        ]) as any;
        
        await updateAuthState(session);
      } catch (error) {
        // Fallback imediato
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          loading: false,
          isApproved: false,
          isAdmin: false,
          userRole: null
        }));
      } else if (event === 'SIGNED_IN') {
        await updateAuthState(session);
      }
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        session: null,
        loading: false,
        isApproved: false,
        isAdmin: false,
        userRole: null,
        connectionStatus: 'disconnected'
      });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro no logout:', error);
      window.location.href = '/auth';
    }
  }, []);

  const reconnect = useCallback(async () => {
    setState(prev => ({ ...prev, connectionStatus: 'reconnecting' }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await updateAuthState(session);
    } catch (error) {
      console.error('Erro na reconexão:', error);
      setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    }
  }, [updateAuthState]);

  return {
    ...state,
    signIn,
    signOut,
    refreshAuth: reconnect,
    reconnect
  };
}
