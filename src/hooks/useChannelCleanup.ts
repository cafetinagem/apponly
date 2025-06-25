import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChannelCleanup() {
  useEffect(() => {
    const cleanup = async () => {
      try {
        // Remover todos os canais ativos
        await supabase.removeAllChannels();
        
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 [ChannelCleanup] Canais limpos com sucesso');
        }
      } catch (error) {
        console.error('❌ [ChannelCleanup] Erro ao limpar canais:', error);
      }
    };

    // Executar limpeza quando o componente desmonta
    return () => {
      cleanup();
    };
  }, []);

  // Helper de debug apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      (window as any).realtimeDebug = () => {
        console.log('💡 [ChannelCleanup] Use realtimeDebug() no console para monitorar conexões');
      };
    }
  }
}
