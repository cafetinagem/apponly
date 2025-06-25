
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { CompletedTasksHeader } from '@/components/completed-tasks/CompletedTasksHeader';
import { CompletedTasksStats } from '@/components/completed-tasks/CompletedTasksStats';
import { CompletedTasksFilters } from '@/components/completed-tasks/CompletedTasksFilters';
import { CompletedTasksList } from '@/components/completed-tasks/CompletedTasksList';
import { CompletedTasksRealtimeSync } from '@/components/completed-tasks/CompletedTasksRealtimeSync';
import { CompletedTasksEmptyStates } from '@/components/completed-tasks/CompletedTasksEmptyStates';
import { PaginationControls } from '@/components/PaginationControls';
import { useCompletedTasksPage } from '@/hooks/tasks/useCompletedTasksPage';
import { Task } from '@/lib/types';

export default function CompletedTasksPage() {
  console.log('✅ [CompletedTasksPage] Rendering page');
  
  const {
    loading,
    tasks,
    allFilteredTasks,
    filters,
    setFilters,
    statistics,
    pagination,
    updateTask,
    deleteTask
  } = useCompletedTasksPage();

  const handleTasksUpdate = () => {
    console.log('Tasks updated via realtime');
  };

  const handleEdit = async (taskId: string, updates: Partial<Task>) => {
    await updateTask({ id: taskId, updates });
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleExportCSV = () => {
    console.log('Export CSV');
  };

  const handleExportJSON = () => {
    console.log('Export JSON');
  };

  const handleReset = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      platform: '',
      assignee: '',
      searchTerm: ''
    });
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      platform: '',
      assignee: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando tarefas concluídas...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
        <CompletedTasksRealtimeSync onTasksUpdate={handleTasksUpdate} />
        
        <CompletedTasksHeader 
          filteredTasksCount={allFilteredTasks.length}
          totalTasksCount={statistics.totalCompleted}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
        
        <CompletedTasksStats statistics={statistics} />
        
        <CompletedTasksFilters 
          filters={filters}
          setFilters={setFilters}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onReset={handleReset}
          taskCount={allFilteredTasks.length}
        />

        {/* Empty States or Task List */}
        <CompletedTasksEmptyStates
          totalCompleted={statistics.totalCompleted}
          filteredTasksCount={allFilteredTasks.length}
          onResetFilters={handleResetFilters}
        />

        {allFilteredTasks.length > 0 && (
          <>
            <CompletedTasksList 
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {pagination.totalPages > 1 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={allFilteredTasks.length}
                pageSize={pagination.pageSize}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={pagination.goToPage}
                onNextPage={pagination.nextPage}
                onPreviousPage={pagination.previousPage}
              />
            )}
          </>
        )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
