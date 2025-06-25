
import { useMemo } from 'react';
import { Task, TaskKPIs } from '@/lib/types';

export function useTaskStatistics(tasks: Task[]): TaskKPIs {
  return useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const totalTimeSpent = tasks.reduce((acc, task) => acc + task.elapsedTime, 0);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      totalTimeSpent,
      averageCompletionTime: completedTasks > 0 ? totalTimeSpent / completedTasks : 0,
      productivityScore: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [tasks]);
}
