
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TodoTasksHeaderProps {
  filteredTasksCount: number;
  totalTasksCount: number;
  onCreateTask: () => void;
}

export function TodoTasksHeader({ 
  filteredTasksCount, 
  totalTasksCount, 
  onCreateTask 
}: TodoTasksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tarefas a Fazer
        </h1>
        <p className="text-gray-600">
          {filteredTasksCount} de {totalTasksCount} tarefas pendentes
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link to="/tasks/in-progress">
          <Button variant="outline">
            Ver Em Progresso
          </Button>
        </Link>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
    </div>
  );
}
