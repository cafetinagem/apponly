import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionDiagnostic {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastCheck: Date | null;
  latency: number | null;
}

export function useConnectionDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<ConnectionDiagnostic>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastCheck: null,
    latency: null
  });

  const checkConnection = useCallback(async () => {
    setDiagnostic(prev => ({ ...prev, isLoading: true, error: null }));
    
    const startTime = Date.now();
    
    try {
      console.log('🔍 [ConnectionDiagnostic] Testando conexão com Supabase...');
      
      // Teste 1: Verificar se consegue fazer uma consulta simples
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);

      const endTime = Date.now();
      const latency = endTime - startTime;

      if (error) {
        console.error('❌ [ConnectionDiagnostic] Erro na consulta:', error);
        throw new Error(`Erro na consulta: ${error.message}`);
      }

      console.log('✅ [ConnectionDiagnostic] Conexão OK, latência:', latency + 'ms');
      
      setDiagnostic({
        isConnected: true,
        isLoading: false,
        error: null,
        lastCheck: new Date(),
        latency
      });

    } catch (error: any) {
      console.error('❌ [ConnectionDiagnostic] Erro de conexão:', error);
      
      setDiagnostic({
        isConnected: false,
        isLoading: false,
        error: error.message || 'Erro desconhecido',
        lastCheck: new Date(),
        latency: null
      });
    }
  }, []);

  // Verificar conexão no mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Verificar conexão a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    ...diagnostic,
    recheckConnection: checkConnection
  };
} 