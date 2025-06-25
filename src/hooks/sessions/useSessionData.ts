
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ModelSession } from './types';
import { useSessionRealtimeSync } from './useSessionRealtimeSync';

export function useSessionData() {
  const [sessions, setSessions] = useState<ModelSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Loading sessions for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('model_sessions')
        .select(`
          *,
          models!inner(name, artistic_name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
      } else {
        console.log('Loaded sessions:', data);
        // Type casting to ensure status is properly typed
        const typedSessions = (data || []).map(session => ({
          ...session,
          status: session.status as 'scheduled' | 'completed' | 'canceled' | 'in-progress'
        }));
        setSessions(typedSessions);
      }
    } catch (error) {
      console.error('Error in loadSessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Usar o novo sistema de realtime
  useSessionRealtimeSync(loadSessions);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    refreshSessions: loadSessions
  };
}
