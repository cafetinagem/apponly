
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeConnection, RealtimeListener, RealtimeConfig } from './types';
import { DEFAULT_REALTIME_CONFIG } from './types';

export class ConnectionManager {
  private connections = new Map<string, RealtimeConnection>();
  private reconnectTimeouts = new Map<string, NodeJS.Timeout>();
  private config: RealtimeConfig;
  private isCleaningUp = false;

  constructor(config: Partial<RealtimeConfig> = {}) {
    this.config = { ...DEFAULT_REALTIME_CONFIG, ...config };
  }

  createConnection(table: string): RealtimeConnection {
    if (this.isCleaningUp) {
      console.log(`⚠️ [ConnectionManager] Ignorando criação durante cleanup: ${table}`);
      throw new Error('Cannot create connection during cleanup');
    }

    console.log(`📡 [ConnectionManager] Criando conexão: ${table}`);
    
    const channelName = `realtime_${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const channel = supabase.channel(channelName);
    
    channel.on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: table
      },
      (payload) => this.handlePayload(table, payload)
    );

    const connection: RealtimeConnection = {
      channel,
      listeners: new Set(),
      isConnected: false,
      reconnectAttempts: 0,
      lastActivity: Date.now()
    };

    channel.subscribe((status) => {
      console.log(`📊 [ConnectionManager] ${table} status: ${status}`);
      
      connection.isConnected = status === 'SUBSCRIBED';
      connection.lastActivity = Date.now();
      
      if (status === 'SUBSCRIBED') {
        connection.reconnectAttempts = 0;
        console.log(`✅ [ConnectionManager] Conectado: ${table}`);
      } else if (status === 'CLOSED' && !this.isCleaningUp) {
        console.log(`🔴 [ConnectionManager] Desconectado: ${table}`);
        this.scheduleReconnect(table);
      }
    });

    this.connections.set(table, connection);
    return connection;
  }

  private handlePayload(table: string, payload: any) {
    const connection = this.connections.get(table);
    if (!connection || connection.listeners.size === 0) return;

    console.log(`📨 [ConnectionManager] ${table} evento:`, {
      event: payload.eventType,
      table: payload.table,
      hasNew: !!payload.new,
      hasOld: !!payload.old
    });

    connection.lastActivity = Date.now();
    
    connection.listeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        console.error(`❌ [ConnectionManager] Erro no listener ${table}:`, error);
      }
    });
  }

  addListener(table: string, listener: RealtimeListener): () => void {
    if (!this.connections.has(table)) {
      this.createConnection(table);
    }

    const connection = this.connections.get(table)!;
    connection.listeners.add(listener);
    connection.lastActivity = Date.now();

    return () => this.removeListener(table, listener);
  }

  private removeListener(table: string, listener: RealtimeListener) {
    const connection = this.connections.get(table);
    if (!connection) return;

    connection.listeners.delete(listener);
    console.log(`🔌 [ConnectionManager] Listener removido de ${table}, restam: ${connection.listeners.size}`);
    
    if (connection.listeners.size === 0) {
      setTimeout(() => this.cleanupConnection(table), this.config.cleanupDelayMs);
    }
  }

  private scheduleReconnect(table: string) {
    const connection = this.connections.get(table);
    if (!connection || connection.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.log(`🛑 [ConnectionManager] Máximo de tentativas atingido: ${table}`);
      return;
    }

    const timeout = this.reconnectTimeouts.get(table);
    if (timeout) clearTimeout(timeout);

    const delay = Math.min(
      this.config.reconnectDelayMs * Math.pow(2, connection.reconnectAttempts), 
      this.config.maxReconnectDelayMs
    );
    console.log(`⏳ [ConnectionManager] Reagendando ${table} em ${delay}ms`);

    const newTimeout = setTimeout(() => {
      if (connection.listeners.size > 0 && !this.isCleaningUp) {
        connection.reconnectAttempts++;
        console.log(`🔄 [ConnectionManager] Tentativa ${connection.reconnectAttempts}: ${table}`);
        
        const listeners = Array.from(connection.listeners);
        this.cleanupConnection(table);
        const newConnection = this.createConnection(table);
        
        setTimeout(() => {
          listeners.forEach(listener => newConnection.listeners.add(listener));
        }, 100);
      }
    }, delay);

    this.reconnectTimeouts.set(table, newTimeout);
  }

  private cleanupConnection(table: string) {
    const connection = this.connections.get(table);
    if (!connection || connection.listeners.size > 0) return;

    console.log(`🧹 [ConnectionManager] Limpando conexão: ${table}`);
    
    try {
      supabase.removeChannel(connection.channel);
    } catch (error) {
      console.error(`❌ [ConnectionManager] Erro ao remover canal:`, error);
    }
    
    this.connections.delete(table);
    
    const timeout = this.reconnectTimeouts.get(table);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(table);
    }
  }

  getConnectionStatus(table: string): boolean {
    return this.connections.get(table)?.isConnected || false;
  }

  getConnectionInfo() {
    const info: Record<string, any> = {};
    this.connections.forEach((conn, table) => {
      info[table] = {
        connected: conn.isConnected,
        listeners: conn.listeners.size,
        attempts: conn.reconnectAttempts,
        lastActivity: new Date(conn.lastActivity).toLocaleTimeString()
      };
    });
    return info;
  }

  cleanup() {
    this.isCleaningUp = true;
    console.log(`🧹 [ConnectionManager] Limpeza geral iniciada`);
    
    this.reconnectTimeouts.forEach(timeout => clearTimeout(timeout));
    this.reconnectTimeouts.clear();
    
    this.connections.forEach((conn, table) => {
      try {
        supabase.removeChannel(conn.channel);
      } catch (error) {
        console.error(`❌ [ConnectionManager] Erro na limpeza ${table}:`, error);
      }
    });
    
    this.connections.clear();
    this.isCleaningUp = false;
    console.log(`✅ [ConnectionManager] Limpeza concluída`);
  }
}
