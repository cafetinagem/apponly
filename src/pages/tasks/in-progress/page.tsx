
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { InProgressTasksHeader } from '@/components/in-progress-tasks/InProgressTasksHeader';
import { InProgressTasksKPIs } from '@/components/in-progress-tasks/InProgressTasksKPIs';
import { InProgressTasksFilters } from '@/components/in-progress-tasks/InProgressTasksFilters';
import { InProgressTasksList } from '@/components/in-progress-tasks/InProgressTasksList';
import { useInProgressTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import { useMemo } from 'react';

export default function InProgressTasksPage() {
  console.log('🔄 [InProgressTasksPage] Rendering page');
  
  const { tasks, loading, updateTask, deleteTask } = useInProgressTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [timerFilter, setTimerFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
      const matchesTimer = timerFilter === 'all' || task.timerStatus === timerFilter;

      return matchesSearch && matchesPriority && matchesAssignee && matchesTimer;
    });
  }, [tasks, searchTerm, priorityFilter, assigneeFilter, timerFilter]);

  const handleEdit = (task: Task) => {
    console.log('Edit task:', task.id);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  if (loading) {
    return (
      <MainLayout>
        <div>Carregando tarefas...</div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <InProgressTasksHeader 
          filteredTasksCount={filteredTasks.length}
          totalTasksCount={tasks.length}
        />
        <InProgressTasksKPIs tasks={filteredTasks} />
        <InProgressTasksFilters 
          searchTerm={searchTerm}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
          timerFilter={timerFilter}
          onSearchChange={setSearchTerm}
          onPriorityChange={setPriorityFilter}
          onAssigneeChange={setAssigneeFilter}
          onTimerChange={setTimerFilter}
        />
        <InProgressTasksList 
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
