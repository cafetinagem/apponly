
import { supabase } from '@/integrations/supabase/client';
import { Task, ChecklistItem } from '@/lib/types';

export async function getTodoTasks(userId: string): Promise<Task[]> {
  console.log('📥 [Query] Carregando tarefas TODO para usuário:', userId);
  
  // Optimized query using composite index idx_tasks_user_status_created
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'todo')
    .order('created_at', { ascending: false })
    .limit(100); // Add reasonable limit

  if (error) {
    console.error('❌ [Query] Erro ao carregar tarefas TODO:', error);
    throw error;
  }

  return formatTasks(data);
}

export async function getInProgressTasks(userId: string): Promise<Task[]> {
  console.log('📥 [Query] Carregando tarefas IN-PROGRESS para usuário:', userId);
  
  // Optimized query using composite index
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in-progress')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('❌ [Query] Erro ao carregar tarefas IN-PROGRESS:', error);
    throw error;
  }

  return formatTasks(data);
}

export async function getCompletedTasks(userId: string): Promise<Task[]> {
  console.log('📥 [Query] Carregando tarefas COMPLETED para usuário:', userId);
  
  // Optimized query using composite index
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('❌ [Query] Erro ao carregar tarefas COMPLETED:', error);
    throw error;
  }

  return formatTasks(data);
}

export async function getAllTasks(userId: string): Promise<Task[]> {
  console.log('📥 [Query] Carregando TODAS as tarefas para usuário:', userId);
  
  // Optimized query with user index
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200); // Reasonable limit for all tasks

  if (error) {
    console.error('❌ [Query] Erro ao carregar todas as tarefas:', error);
    throw error;
  }

  return formatTasks(data);
}

// Optimized function to get task counts without loading full data
export async function getTaskCounts(userId: string) {
  console.log('📊 [Query] Carregando contadores de tarefas para usuário:', userId);
  
  try {
    // Use Promise.all to run queries in parallel
    const [todoResult, inProgressResult, completedResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'todo'),
      
      supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'in-progress'),
      
      supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'done')
    ]);

    return {
      todo: todoResult.count || 0,
      inProgress: inProgressResult.count || 0,
      completed: completedResult.count || 0,
      total: (todoResult.count || 0) + (inProgressResult.count || 0) + (completedResult.count || 0)
    };
  } catch (error) {
    console.error('❌ [Query] Erro ao carregar contadores:', error);
    return { todo: 0, inProgress: 0, completed: 0, total: 0 };
  }
}

function formatTasks(data: any[]): Task[] {
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
}
