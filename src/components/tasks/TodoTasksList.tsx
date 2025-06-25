
import React from 'react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Task } from '@/lib/types';

interface TodoTasksListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function TodoTasksList({ tasks, onEdit, onDelete, onStatusChange }: TodoTasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nenhuma tarefa pendente
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie uma nova tarefa para começar a organizar seu trabalho.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
