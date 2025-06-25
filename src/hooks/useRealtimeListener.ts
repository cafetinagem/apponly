
import { useEffect, useRef, useCallback } from 'react';
import { registerRealtimeListener } from '@/lib/realtimeManager';

type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';
type RealtimeCallback = (payload: any) => void;

interface RealtimeConfig {
  table: string;
  event?: RealtimeEventType;
  filter?: { column: string; value: string };
  enabled?: boolean;
}

export function useRealtimeListener(
  config: RealtimeConfig,
  callback: RealtimeCallback
) {
  const callbackRef = useRef(callback);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  const { table, enabled = true } = config;

  // Atualizar callback sem recriar o listener
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stableCallback = useCallback((payload: any) => {
    if (mountedRef.current) {
      callbackRef.current(payload);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!enabled) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    console.log(`🎯 [useRealtimeListener] Configurando listener: ${table}`);
    
    try {
      unsubscribeRef.current = registerRealtimeListener(table, stableCallback);
    } catch (error) {
      console.error(`❌ [useRealtimeListener] Erro ao configurar ${table}:`, error);
    }

    return () => {
      mountedRef.current = false;
      if (unsubscribeRef.current) {
        console.log(`🔌 [useRealtimeListener] Desconectando: ${table}`);
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [table, enabled, stableCallback]);

  const disconnect = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  return { disconnect };
}
