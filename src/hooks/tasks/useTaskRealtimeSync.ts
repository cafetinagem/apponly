
import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { registerRealtimeListener } from '@/lib/realtimeManager';
import { useToast } from '@/hooks/use-toast';

export function useTaskRealtimeSync(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const lastUpdateRef = useRef<number>(0);

  const invalidateTaskQueries = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.log('🔄 [TaskRealtimeSync] Invalidando queries de tarefas');
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task-statistics'] });
    queryClient.invalidateQueries({ queryKey: ['completed-tasks'] });
  }, [queryClient]);

  const handleTaskUpdate = useCallback((payload: any) => {
    if (!mountedRef.current) return;
    
    // Throttle de updates para evitar spam
    const now = Date.now();
    if (now - lastUpdateRef.current < 1000) return;
    lastUpdateRef.current = now;
    
    console.log('📨 [TaskRealtimeSync] Update recebido:', payload);
    
    const { eventType, new: newData, old: oldData } = payload;
    const taskUserId = newData?.user_id || oldData?.user_id;
    
    // Only process updates for current user
    if (taskUserId !== userId) {
      console.log('👤 [TaskRealtimeSync] Update ignorado - usuário diferente');
      return;
    }
    
    console.log('✅ [TaskRealtimeSync] Processando update para usuário atual');
    invalidateTaskQueries();
    
    // Show appropriate toast messages
    if (eventType === 'INSERT') {
      toast({
        title: "Nova tarefa criada! ✨",
        description: newData?.title || "Tarefa adicionada ao sistema"
      });
    } else if (eventType === 'UPDATE') {
      const statusChanged = oldData?.status !== newData?.status;
      if (statusChanged) {
        const statusLabels = {
          'todo': 'A Fazer',
          'in-progress': 'Em Progresso',
          'done': 'Finalizada'
        };
        toast({
          title: "Tarefa atualizada! 🔄",
          description: `Status alterado para: ${statusLabels[newData.status as keyof typeof statusLabels] || newData.status}`
        });
      }
    } else if (eventType === 'DELETE') {
      toast({
        title: "Tarefa excluída! 🗑️",
        description: "A tarefa foi removida do sistema"
      });
    }
  }, [userId, invalidateTaskQueries, toast]);

  // Setup realtime subscription
  useEffect(() => {
    mountedRef.current = true;
    
    if (!userId) {
      console.log('⚠️ [TaskRealtimeSync] UserId não disponível, aguardando...');
      return;
    }

    console.log('🔌 [TaskRealtimeSync] Configurando listener para usuário:', userId);
    
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = registerRealtimeListener('tasks', handleTaskUpdate);
    } catch (error) {
      console.error('❌ [TaskRealtimeSync] Erro ao configurar listener:', error);
    }

    return () => {
      mountedRef.current = false;
      console.log('🧹 [TaskRealtimeSync] Limpando subscription');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, handleTaskUpdate]);

  return {
    invalidateTaskQueries
  };
}
