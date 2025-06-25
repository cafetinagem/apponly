
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useUserSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ [UserSession] Erro ao obter sessão:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ [UserSession] Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    setUser,
    setSession,
    setLoading
  };
}
