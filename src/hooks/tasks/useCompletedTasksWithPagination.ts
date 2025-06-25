
import { useMemo } from 'react';
import { usePagination } from '@/hooks/usePagination';
import { useCompletedTasksLogic, CompletedTasksFilters } from './useCompletedTasksLogic';

export function useCompletedTasksWithPagination() {
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

  // Extra safety to ensure we always have arrays
  const safeFilteredTasks = useMemo(() => {
    if (!Array.isArray(filteredTasks)) {
      console.log('⚠️ [CompletedTasksWithPagination] Filtered tasks is not an array, using empty array');
      return [];
    }
    return filteredTasks;
  }, [filteredTasks]);

  // Setup pagination with page size of 10
  const pagination = usePagination(safeFilteredTasks, {
    initialPage: 1,
    pageSize: 10
  });

  console.log('📊 [CompletedTasksWithPagination] Final data:', {
    safeFilteredTasksLength: safeFilteredTasks.length,
    paginationDataLength: pagination.data.length,
    loading
  });

  return {
    loading,
    tasks: pagination.data, // Paginated tasks
    allFilteredTasks: safeFilteredTasks, // All filtered tasks for counts
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
