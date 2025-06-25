import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Task, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface CompletedTasksFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  platform: string;
  assignee: string;
  searchTerm: string;
}

export function useCompletedTasksLogic() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<CompletedTasksFilters>({
    dateRange: { from: undefined, to: undefined },
    platform: '',
    assignee: '',
    searchTerm: ''
  });

  const { data: completedTasks = [], isLoading: loading } = useQuery({
    queryKey: ['completed-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'done')
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(task => {
        // Convert checklist from Json to ChecklistItem[]
        let checklist: ChecklistItem[] = [];
        if (Array.isArray(task.checklist)) {
          checklist = task.checklist.map((item: any) => {
            if (typeof item === 'object' && item !== null && 'id' in item && 'text' in item && 'completed' in item) {
              return item as ChecklistItem;
            }
            return {
              id: Math.random().toString(36).substr(2, 9),
              text: typeof item === 'string' ? item : '',
              completed: false
            } as ChecklistItem;
          });
        }

        return {
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
          checklist,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
          completedAt: task.completed_at ? new Date(task.completed_at) : undefined
        } as Task;
      });
    },
    enabled: !!user
  });

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(completedTasks)) return [];

    return completedTasks.filter(task => {
      const matchesSearch = !filters.searchTerm || 
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const matchesPlatform = !filters.platform || task.platform === filters.platform;
      const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;

      const matchesDateRange = (!filters.dateRange.from || !filters.dateRange.to) || 
        (task.completedAt && 
         task.completedAt >= filters.dateRange.from && 
         task.completedAt <= filters.dateRange.to);

      return matchesSearch && matchesPlatform && matchesAssignee && matchesDateRange;
    });
  }, [completedTasks, filters]);

  const statistics = useMemo(() => {
    if (!Array.isArray(filteredTasks)) {
      return {
        totalCompleted: 0,
        totalTimeSpent: 0,
        averageTimePerTask: 0,
        productivityScore: 0,
        platformStats: [],
        assigneeStats: []
      };
    }

    const totalCompleted = filteredTasks.length;
    const totalTimeSpent = filteredTasks.reduce((acc, task) => {
      const time = Number(task.elapsedTime) || 0;
      return acc + time;
    }, 0);

    const averageTimePerTask = totalCompleted > 0 ? totalTimeSpent / totalCompleted : 0;

    const platformCounts = filteredTasks.reduce((acc, task) => {
      const platform = task.platform || 'Sem plataforma';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assigneeCounts = filteredTasks.reduce((acc, task) => {
      const assignee = task.assignee || 'Não atribuído';
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const platformStats = Object.entries(platformCounts).map(([platform, count]) => ({
      platform,
      count,
      percentage: totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0
    }));

    const assigneeStats = Object.entries(assigneeCounts).map(([assignee, count]) => ({
      assignee,
      count,
      percentage: totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0
    }));

    return {
      totalCompleted,
      totalTimeSpent,
      averageTimePerTask,
      productivityScore: Math.round((totalCompleted / Math.max(1, totalCompleted)) * 100),
      platformStats,
      assigneeStats
    };
  }, [filteredTasks]);

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Task, 'checklist'>> & { checklist?: any } }) => {
      // Convert Task fields to database format
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.platform !== undefined) updateData.platform = updates.platform;
      if (updates.assignee !== undefined) updateData.assignee = updates.assignee;
      if (updates.timeEstimate !== undefined) updateData.time_estimate = updates.timeEstimate;
      if (updates.timeType !== undefined) updateData.time_type = updates.timeType;
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline?.toISOString();
      if (updates.elapsedTime !== undefined) updateData.elapsed_time = updates.elapsedTime;
      if (updates.timerStatus !== undefined) updateData.timer_status = updates.timerStatus;
      if (updates.timerStartTime !== undefined) updateData.timer_start_time = updates.timerStartTime;
      if (updates.checklist !== undefined) updateData.checklist = updates.checklist;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt?.toISOString();

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-tasks'] });
      toast({ title: "Tarefa atualizada!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar tarefa", variant: "destructive" });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-tasks'] });
      toast({ title: "Tarefa excluída!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir tarefa", variant: "destructive" });
    }
  });

  const resetCompletedTasks = useCallback(() => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      platform: '',
      assignee: '',
      searchTerm: ''
    });
  }, []);

  const exportReport = useCallback(() => {
    if (!Array.isArray(filteredTasks) || filteredTasks.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há tarefas concluídas para exportar.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['Título', 'Descrição', 'Prioridade', 'Plataforma', 'Responsável', 'Tempo Gasto', 'Data de Conclusão'],
      ...filteredTasks.map(task => [
        task.title,
        task.description || '',
        task.priority,
        task.platform || '',
        task.assignee || '',
        `${task.elapsedTime || 0} min`,
        task.completedAt?.toLocaleDateString('pt-BR') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tarefas-concluidas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Relatório exportado!",
      description: "O arquivo CSV foi baixado com sucesso."
    });
  }, [filteredTasks, toast]);

  return {
    loading,
    completedTasks,
    filteredTasks,
    filters,
    setFilters,
    statistics,
    resetCompletedTasks,
    exportReport,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate
  };
}
