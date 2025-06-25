
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task } from '@/lib/types';
import { TaskCard } from '@/components/task-card';

interface InProgressTasksListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function InProgressTasksList({ 
  tasks, 
  onEdit, 
  onDelete
}: InProgressTasksListProps) {
  if (tasks.length > 0) {
    return (
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <Card className="p-8 text-center">
      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-700 font-medium mb-2">Nenhuma tarefa em progresso</p>
      <p className="text-sm text-gray-500 mb-4">Inicie uma tarefa para vê-la aqui.</p>
      <Link to="/tasks/todo">
        <Button>
          Ver Tarefas Pendentes
        </Button>
      </Link>
    </Card>
  );
}
