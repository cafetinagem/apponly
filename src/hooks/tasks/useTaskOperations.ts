
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, ChecklistItem } from '@/lib/types';

export function useTaskOperations(user: any) {
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'elapsedTime' | 'timerStatus'>) => {
    if (!user) {
      console.error('❌ [TaskOperations] Usuário não autenticado');
      return null;
    }

    console.log('➕ [TaskOperations] ===== CRIANDO TAREFA =====');
    console.log('📋 [TaskOperations] Dados:', taskData.title);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          platform: taskData.platform,
          assignee: taskData.assignee,
          time_estimate: taskData.timeEstimate,
          time_type: taskData.timeType,
          deadline: taskData.deadline?.toISOString(),
          checklist: taskData.checklist ? JSON.parse(JSON.stringify(taskData.checklist)) : [],
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [TaskOperations] Erro ao criar tarefa:', error);
        throw error;
      }

      console.log('✅ [TaskOperations] Tarefa criada com sucesso:', data.id);
      return data;
    } catch (error) {
      console.error('💥 [TaskOperations] Erro crítico ao criar tarefa:', error);
      return null;
    }
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!user) {
      console.error('❌ [TaskOperations] Usuário não autenticado');
      return null;
    }

    console.log('✏️ [TaskOperations] ===== ATUALIZANDO TAREFA =====');
    console.log('📋 [TaskOperations] ID:', id);
    console.log('📊 [TaskOperations] Updates:', updates);
    
    try {
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
      if (updates.checklist !== undefined) {
        updateData.checklist = updates.checklist ? JSON.parse(JSON.stringify(updates.checklist)) : [];
      }
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt?.toISOString();

      console.log('🔄 [TaskOperations] Dados a serem atualizados:', updateData);

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ [TaskOperations] Erro ao atualizar tarefa:', error);
        throw error;
      }

      console.log('✅ [TaskOperations] Tarefa atualizada com sucesso:', data.id);
      return data;
    } catch (error) {
      console.error('💥 [TaskOperations] Erro crítico ao atualizar tarefa:', error);
      return null;
    }
  }, [user]);

  const deleteTask = useCallback(async (id: string) => {
    if (!user) {
      console.error('❌ [TaskOperations] Usuário não autenticado');
      return false;
    }

    console.log('🗑️ [TaskOperations] ===== EXCLUINDO TAREFA =====');
    console.log('📋 [TaskOperations] ID:', id);

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [TaskOperations] Erro ao excluir tarefa:', error);
        throw error;
      }

      console.log('✅ [TaskOperations] Tarefa excluída com sucesso');
      return true;
    } catch (error) {
      console.error('💥 [TaskOperations] Erro crítico ao excluir tarefa:', error);
      return false;
    }
  }, [user]);

  return {
    createTask,
    updateTask,
    deleteTask
  };
}
