import { ConnectionManager } from './realtime/connectionManager';
import type { RealtimeListener } from './realtime/types';

// Singleton para evitar múltiplas instâncias
let connectionManagerInstance: ConnectionManager | null = null;

const getConnectionManager = () => {
  if (!connectionManagerInstance) {
    connectionManagerInstance = new ConnectionManager();
  }
  return connectionManagerInstance;
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const manager = getConnectionManager();
    manager.cleanup();
    connectionManagerInstance = null;
  });
  
  // Debug global apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    (window as any).realtimeDebug = () => {
      const manager = getConnectionManager();
      console.log('🔍 [Debug] Conexões ativas:', manager.getConnectionInfo());
    };
  }
}

export const registerRealtimeListener = (table: string, listener: RealtimeListener) => {
  const manager = getConnectionManager();
  return manager.addListener(table, listener);
};

export const getRealtimeStatus = (table: string) => {
  const manager = getConnectionManager();
  return manager.getConnectionStatus(table);
};

export const getRealtimeInfo = () => {
  const manager = getConnectionManager();
  return manager.getConnectionInfo();
};

// Limpar instância (usado apenas em desenvolvimento e testes)
export const resetConnectionManager = () => {
  if (connectionManagerInstance) {
    connectionManagerInstance.cleanup();
    connectionManagerInstance = null;
  }
};
