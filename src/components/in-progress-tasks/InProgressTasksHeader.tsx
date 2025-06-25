
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InProgressTasksHeaderProps {
  filteredTasksCount: number;
  totalTasksCount: number;
}

export function InProgressTasksHeader({ 
  filteredTasksCount, 
  totalTasksCount
}: InProgressTasksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tarefas em Progresso
        </h1>
        <p className="text-gray-600">
          {filteredTasksCount} de {totalTasksCount} tarefas ativas
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link to="/tasks/todo">
          <Button variant="outline">
            Ver Tarefas Pendentes
          </Button>
        </Link>
        <Link to="/tasks/todo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </Link>
      </div>
    </div>
  );
}
