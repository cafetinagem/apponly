
import { useEffect, useRef } from 'react';
import { registerRealtimeListener } from '@/lib/realtimeManager';

export function useModelsRealtime(userId: string | undefined, onUpdate: () => void) {
  const realtimeUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log('🔌 [Models] No userId, skipping realtime setup');
      return;
    }

    // Evitar setup múltiplo
    if (realtimeUnsubscribeRef.current) {
      console.log('🔌 [Models] Realtime already setup, skipping');
      return;
    }

    console.log('🔌 [Models] Setting up realtime listener for user:', userId);
    const unsubscribe = registerRealtimeListener('models', (payload: any) => {
      const payloadUserId = payload.new?.user_id || payload.old?.user_id;
      if (payloadUserId === userId) {
        console.log('🔄 [Models] Realtime update received, refreshing');
        onUpdate();
      }
    });

    realtimeUnsubscribeRef.current = unsubscribe;

    return () => {
      console.log('🔌 [Models] Cleaning up realtime listener');
      if (realtimeUnsubscribeRef.current) {
        realtimeUnsubscribeRef.current();
        realtimeUnsubscribeRef.current = null;
      }
    };
  }, [userId]); // Removido onUpdate das dependências para evitar loop

  return {
    disconnect: () => {
      if (realtimeUnsubscribeRef.current) {
        realtimeUnsubscribeRef.current();
        realtimeUnsubscribeRef.current = null;
      }
    }
  };
}
