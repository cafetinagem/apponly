
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { TodoTasksHeader } from '@/components/todo-tasks/TodoTasksHeader';
import { TodoTasksKPIs } from '@/components/todo-tasks/TodoTasksKPIs';
import { TodoTasksFilters } from '@/components/todo-tasks/TodoTasksFilters';
import { TodoTasksList } from '@/components/todo-tasks/TodoTasksList';
import { useTodoTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import { useMemo } from 'react';

export default function TodoTasksPage() {
  console.log('📋 [TodoTasksPage] Rendering page');
  
  const { tasks, loading, updateTask, deleteTask } = useTodoTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchTerm, priorityFilter, assigneeFilter]);

  const handleCreateTask = () => {
    console.log('Create new task');
  };

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
        <TodoTasksHeader 
          filteredTasksCount={filteredTasks.length}
          totalTasksCount={tasks.length}
          onCreateTask={handleCreateTask}
        />
        <TodoTasksKPIs tasks={filteredTasks} />
        <TodoTasksFilters 
          searchTerm={searchTerm}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
          onSearchChange={setSearchTerm}
          onPriorityChange={setPriorityFilter}
          onAssigneeChange={setAssigneeFilter}
        />
        <TodoTasksList 
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateTask={handleCreateTask}
          totalTasksCount={tasks.length}
        />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
