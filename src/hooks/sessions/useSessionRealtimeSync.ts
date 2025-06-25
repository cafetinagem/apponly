
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { registerRealtimeListener } from '@/lib/realtimeManager';

export function useSessionRealtimeSync(refreshSessions: () => void) {
  const { user } = useAuth();

  const handleRealtimeUpdate = useCallback((payload: any) => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = registerRealtimeListener('model_sessions', handleRealtimeUpdate);
    return unsubscribe;
  }, [user?.id, handleRealtimeUpdate]);
}
