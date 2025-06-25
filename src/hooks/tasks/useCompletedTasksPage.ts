
import { useMemo } from 'react';
import { usePagination } from '@/hooks/usePagination';
import { useCompletedTasksLogic, CompletedTasksFilters } from './useCompletedTasksLogic';

export function useCompletedTasksPage() {
  const {
    loading,
    completedTasks,
    filteredTasks,
    filters,
    setFilters,
    statistics,
    resetCompletedTasks,
    exportReport,
    updateTask,
    deleteTask
  } = useCompletedTasksLogic();

  const safeFilteredTasks = useMemo(() => {
    if (!Array.isArray(filteredTasks)) {
      console.log('⚠️ [CompletedTasksPage] Filtered tasks is not an array, using empty array');
      return [];
    }
    return filteredTasks;
  }, [filteredTasks]);

  const pagination = usePagination(safeFilteredTasks, {
    initialPage: 1,
    pageSize: 10
  });

  return {
    loading,
    tasks: pagination.data,
    allFilteredTasks: safeFilteredTasks,
    filters,
    setFilters,
    statistics,
    pagination,
    resetCompletedTasks,
    exportReport,
    updateTask,
    deleteTask
  };
}
