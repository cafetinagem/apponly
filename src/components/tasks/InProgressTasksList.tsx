
import React from 'react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskTimer } from '@/components/TaskTimer';
import { Task } from '@/lib/types';

interface InProgressTasksListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function InProgressTasksList({ tasks, onEdit, onDelete, onStatusChange }: InProgressTasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nenhuma tarefa em execução
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Inicie uma tarefa da página "A Fazer" para vê-la aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task.id} className="bg-card rounded-lg p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300">
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <TaskTimer task={task} />
            </div>
          </div>
          
          <TaskCard 
            task={task} 
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            showActions={true}
          />
        </div>
      ))}
    </div>
  );
}
