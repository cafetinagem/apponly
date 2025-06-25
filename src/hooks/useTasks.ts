
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useTaskOperations } from '@/hooks/tasks/useTaskOperations';
import { useTaskRealtimeSync } from '@/hooks/tasks/useTaskRealtimeSync';
import { supabase } from '@/integrations/supabase/client';
import { Task, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

const formatTasks = (data: any[]): Task[] => {
  return data.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as Task['status'],
    priority: task.priority as Task['priority'],
    platform: task.platform,
    assignee: task.assignee as Task['assignee'],
    timeEstimate: task.time_estimate,
    timeType: task.time_type as Task['timeType'],
    deadline: task.deadline ? new Date(task.deadline) : undefined,
    elapsedTime: task.elapsed_time || 0,
    timerStatus: task.timer_status as Task['timerStatus'],
    timerStartTime: task.timer_start_time,
    checklist: Array.isArray(task.checklist) 
      ? task.checklist.map((item: any) => {
          if (typeof item === 'object' && item !== null && 'id' in item && 'text' in item && 'completed' in item) {
            return item as ChecklistItem;
          }
          return {
            id: Math.random().toString(36).substr(2, 9),
            text: typeof item === 'string' ? item : '',
            completed: false
          } as ChecklistItem;
        })
      : [],
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
    completedAt: task.completed_at ? new Date(task.completed_at) : undefined
  }));
};

export function useTasks(status?: Task['status']) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createTask, updateTask, deleteTask } = useTaskOperations(user);

  const queryKey = useMemo(() => 
    status ? ['tasks', user?.id, status] : ['tasks', user?.id]
  , [status, user?.id]);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return formatTasks(data || []);
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    retry: 2
  });

  useTaskRealtimeSync(user?.id);

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Tarefa criada com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao criar tarefa", 
        variant: "destructive" 
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => 
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar tarefa", 
        variant: "destructive" 
      });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast({ 
        title: "Erro ao excluir tarefa", 
        variant: "destructive" 
      });
    }
  });

  return {
    tasks,
    loading: isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending
  };
}

export const useTodoTasks = () => useTasks('todo');
export const useInProgressTasks = () => useTasks('in-progress');
export const useCompletedTasks = () => useTasks('done');
export const useAllTasks = () => useTasks();
