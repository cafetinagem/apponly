
import { supabase } from '@/integrations/supabase/client';

interface ConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  lastError: Error | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

class ConnectionManager {
  private state: ConnectionState = {
    isConnected: false,
    isReconnecting: false,
    lastError: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  };

  private listeners: ((state: ConnectionState) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startConnectionMonitoring();
  }

  private startConnectionMonitoring() {
    // Verificar conexão a cada 30 segundos
    this.checkInterval = setInterval(() => {
      this.checkConnection();
    }, 30000);

    // Verificação inicial
    this.checkConnection();
  }

  public async checkConnection(): Promise<boolean> {
    try {
      console.log('🔍 [ConnectionManager] Verificando conexão...');
      
      const { error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ [ConnectionManager] Erro de conexão:', error);
        this.updateState({
          isConnected: false,
          lastError: error as Error,
          isReconnecting: false
        });
        return false;
      }

      console.log('✅ [ConnectionManager] Conexão OK');
      this.updateState({
        isConnected: true,
        lastError: null,
        reconnectAttempts: 0,
        isReconnecting: false
      });
      return true;
    } catch (error) {
      console.error('❌ [ConnectionManager] Erro inesperado:', error);
      this.updateState({
        isConnected: false,
        lastError: error as Error,
        isReconnecting: false
      });
      return false;
    }
  }

  public async reconnect(): Promise<boolean> {
    if (this.state.isReconnecting) {
      console.log('⏳ [ConnectionManager] Reconexão já em andamento');
      return false;
    }

    if (this.state.reconnectAttempts >= this.state.maxReconnectAttempts) {
      console.log('❌ [ConnectionManager] Máximo de tentativas atingido');
      return false;
    }

    console.log(`🔄 [ConnectionManager] Tentativa de reconexão ${this.state.reconnectAttempts + 1}/${this.state.maxReconnectAttempts}`);
    
    this.updateState({
      isReconnecting: true,
      reconnectAttempts: this.state.reconnectAttempts + 1
    });

    // Aguardar um pouco antes de tentar reconectar
    await new Promise(resolve => setTimeout(resolve, 2000 * this.state.reconnectAttempts));

    const success = await this.checkConnection();
    
    if (success) {
      console.log('✅ [ConnectionManager] Reconexão bem-sucedida');
    } else {
      console.log('❌ [ConnectionManager] Falha na reconexão');
    }

    return success;
  }

  public subscribe(listener: (state: ConnectionState) => void): () => void {
    this.listeners.push(listener);
    
    // Enviar estado atual imediatamente
    listener(this.state);
    
    // Retornar função de unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public getState(): ConnectionState {
    return { ...this.state };
  }

  private updateState(updates: Partial<ConnectionState>) {
    this.state = { ...this.state, ...updates };
    
    // Notificar todos os listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('❌ [ConnectionManager] Erro no listener:', error);
      }
    });
  }

  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.listeners = [];
  }
}

// Singleton instance
let connectionManager: ConnectionManager | null = null;

export const getConnectionManager = (): ConnectionManager => {
  if (!connectionManager) {
    connectionManager = new ConnectionManager();
  }
  return connectionManager;
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (connectionManager) {
      connectionManager.destroy();
      connectionManager = null;
    }
  });
}
