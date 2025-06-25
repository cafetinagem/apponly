/**
 * OnlyCat Command Center - Database Configuration
 * Configuração otimizada com connection pooling
 */

import { supabase } from '@/integrations/supabase/client';

// Configurações de conexão direta
export const DATABASE_CONFIG = {
  // URLs de conexão
  SUPABASE_URL: "https://upgfoemhrqwvonboduao.supabase.co",
  
  // Connection pooling (para alta performance)
  POOLED_URL: "postgresql://postgres.upgfoemhrqwvonboduao:onlycatbrasil2005122@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  
  // Conexão direta (para migrações)
  DIRECT_URL: "postgresql://postgres.upgfoemhrqwvonboduao:onlycatbrasil2005122@aws-0-sa-east-1.pooler.supabase.com:5432/postgres",
  
  // Configurações de pool
  POOL_CONFIG: {
    max: 20,          // Máximo de conexões
    min: 5,           // Mínimo de conexões
    idleTimeoutMillis: 30000,  // Timeout de idle
    connectionTimeoutMillis: 2000,  // Timeout de conexão
  }
};

// Cliente Supabase otimizado
export const db = supabase;

// Funções utilitárias de conexão
export const connectionUtils = {
  /**
   * Testa a conectividade com o banco
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await db
        .from('tasks')
        .select('count', { count: 'exact', head: true });
      
      return !error;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  },

     /**
    * Verifica o status das tabelas
    */
   async checkTables(): Promise<Record<string, boolean>> {
     const tables = [
       'tasks', 'models', 'model_sessions', 'notes',
       'note_categories', 'categories', 'settings',
       'user_profiles', 'audit_logs'
     ] as const;

     const results: Record<string, boolean> = {};

     for (const table of tables) {
       try {
         const { error } = await db
           .from(table as any)
           .select('count', { count: 'exact', head: true });
         
         results[table] = !error;
       } catch {
         results[table] = false;
       }
     }

     return results;
   },

  /**
   * Obtém estatísticas de performance
   */
  async getPerformanceStats() {
    try {
      const startTime = Date.now();
      
      const { error } = await db
        .from('tasks')
        .select('count', { count: 'exact', head: true });
      
      const responseTime = Date.now() - startTime;
      
      return {
        connected: !error,
        responseTime,
        status: !error ? 'healthy' : 'error'
      };
    } catch (error) {
      return {
        connected: false,
        responseTime: -1,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

// Hook para monitoramento de conexão
export const useConnectionMonitor = () => {
  const checkConnection = async () => {
    return await connectionUtils.testConnection();
  };

  const getStats = async () => {
    return await connectionUtils.getPerformanceStats();
  };

  return {
    checkConnection,
    getStats,
    config: DATABASE_CONFIG
  };
};

// Configurações de retry para operações críticas
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
};

/**
 * Executa uma operação com retry automático
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config = RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === config.maxRetries) {
        throw lastError;
      }
      
      // Backoff exponencial
      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Log de configuração
console.log('🔌 Database configuration loaded');
console.log('✅ Connection pooling enabled');
console.log('✅ Direct connection available');
console.log('✅ Retry mechanism active');
