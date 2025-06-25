
import { useState, useEffect } from 'react';
import { getConnectionManager } from '@/lib/connectionManager';

interface ConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  lastError: Error | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export function useConnectionStatus() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isReconnecting: false,
    lastError: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  });

  useEffect(() => {
    const manager = getConnectionManager();
    
    const unsubscribe = manager.subscribe((state) => {
      setConnectionState(state);
    });

    return unsubscribe;
  }, []);

  const reconnect = async () => {
    const manager = getConnectionManager();
    return await manager.reconnect();
  };

  const checkConnection = async () => {
    const manager = getConnectionManager();
    return await manager.checkConnection();
  };

  return {
    ...connectionState,
    reconnect,
    checkConnection
  };
}
