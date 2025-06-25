
import React from 'react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompletedTasksListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function CompletedTasksList({ tasks, onEdit, onDelete, onStatusChange }: CompletedTasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nenhuma tarefa finalizada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Complete algumas tarefas para vê-las aqui.
        </p>
      </div>
    );
  }

  // Agrupar tarefas por data de conclusão
  const tasksByDate = tasks.reduce((groups, task) => {
    const dateKey = task.completedAt 
      ? format(new Date(task.completedAt), 'yyyy-MM-dd')
      : 'sem-data';
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'sem-data') return 1;
    if (b === 'sem-data') return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="space-y-8">
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
            {dateKey === 'sem-data' 
              ? 'Sem data de conclusão' 
              : format(new Date(dateKey), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            }
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({tasksByDate[dateKey].length} tarefa{tasksByDate[dateKey].length !== 1 ? 's' : ''})
            </span>
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasksByDate[dateKey].map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
