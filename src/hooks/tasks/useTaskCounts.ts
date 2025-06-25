
import { useMemo } from 'react';
import { useAllTasks } from '@/hooks/useTasks';

export function useTaskCounts() {
  const { tasks } = useAllTasks();

  const counts = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return {
        todoCount: 0,
        inProgressCount: 0,
        completedCount: 0,
        totalCount: 0
      };
    }

    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const completedCount = tasks.filter(t => t.status === 'done').length;
    const totalCount = tasks.length;

    return {
      todoCount,
      inProgressCount, 
      completedCount,
      totalCount
    };
  }, [tasks]);

  return counts;
}
