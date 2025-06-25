
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeListener } from '@/hooks/useRealtimeListener';

interface CompletedTasksRealtimeSyncProps {
  onTasksUpdate: () => void;
}

export function CompletedTasksRealtimeSync({ onTasksUpdate }: CompletedTasksRealtimeSyncProps) {
  const { user, isApproved } = useAuth();
  const { toast } = useToast();

  // Hook otimizado sem duplicações
  useRealtimeListener(
    {
      table: 'tasks',
      enabled: !!user?.id && isApproved
    },
    (payload) => {
      const evento = payload.eventType;
      const novoStatus = payload.new?.status;
      const statusAnterior = payload.old?.status;
      const userId = payload.new?.user_id || payload.old?.user_id;
      
      console.log('📨 [CompletedTasksRealtime] Evento:', { 
        evento, 
        novoStatus, 
        statusAnterior, 
        userId,
        isOwner: userId === user?.id 
      });
      
      // Verificar se é do usuário atual
      if (userId !== user?.id) {
        console.log('👤 [CompletedTasksRealtime] Ignorando - usuário diferente');
        return;
      }
      
      const envolveFinalizadas = [novoStatus, statusAnterior].includes('done');
      
      if (envolveFinalizadas) {
        console.log('✅ [CompletedTasksRealtime] Atualizando lista de finalizadas');
        onTasksUpdate();
        
        // Toasts otimizados
        if (evento === 'DELETE' && statusAnterior === 'done') {
          toast({
            title: "Tarefa Excluída! 🗑️",
            description: "Removida das finalizadas instantaneamente",
            className: "border-red-200 dark:border-red-800"
          });
        } else if (evento === 'UPDATE' && novoStatus === 'done' && statusAnterior !== 'done') {
          toast({
            title: "Tarefa Concluída! ✅",
            description: "Movida para finalizadas automaticamente",
            className: "border-green-200 dark:border-green-800"
          });
        } else if (evento === 'INSERT' && novoStatus === 'done') {
          toast({
            title: "Nova Finalizada! 🎉",
            description: "Tarefa adicionada às finalizadas",
            className: "border-green-200 dark:border-green-800"
          });
        } else if (evento === 'UPDATE' && statusAnterior === 'done' && novoStatus !== 'done') {
          toast({
            title: "Tarefa Reaberta! 🔄",
            description: "Removida das finalizadas",
            className: "border-amber-200 dark:border-amber-800"
          });
        }
      }
    }
  );

  useEffect(() => {
    if (user?.id && isApproved) {
      console.log('🔌 [CompletedTasksRealtime] Configurado para:', user.email);
    }
  }, [user?.id, user?.email, isApproved]);

  return null;
}
