
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, ChecklistItem } from '@/lib/types';

export function useTaskData(user: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log('Loading tasks for user:', user.id);
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
    } else {
      const formattedTasks: Task[] = data.map(task => ({
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
        checklist: Array.isArray(task.checklist) ? (task.checklist as unknown as ChecklistItem[]) : [],
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined
      }));
      console.log('Tasks loaded:', formattedTasks.length);
      setTasks(formattedTasks);
    }
    setLoading(false);
  }, [user]);

  return {
    tasks,
    loading,
    loadTasks
  };
}
