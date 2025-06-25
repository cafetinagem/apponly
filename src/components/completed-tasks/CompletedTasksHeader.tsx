
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompletedTasksHeaderProps {
  filteredTasksCount: number;
  totalTasksCount: number;
  currentPage: number;
  totalPages: number;
}

export function CompletedTasksHeader({ 
  filteredTasksCount, 
  totalTasksCount,
  currentPage,
  totalPages
}: CompletedTasksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          Tarefas Concluídas
          {totalTasksCount > 0 && (
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {totalTasksCount}
            </span>
          )}
        </h1>
        <p className="text-gray-600">
          Mostrando {filteredTasksCount} de {totalTasksCount} tarefas filtradas
          {totalPages > 1 && (
            <span className="text-blue-600 ml-1">
              (Página {currentPage} de {totalPages})
            </span>
          )}
        </p>
      </div>
      
      <div className="flex gap-2 mt-4 sm:mt-0">
        <Link to="/tasks/todo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </Link>
        <Link to="/tasks">
          <Button variant="outline">
            Ver Todas
          </Button>
        </Link>
      </div>
    </div>
  );
}
