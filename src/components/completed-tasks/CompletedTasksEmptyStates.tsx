
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompletedTasksEmptyStatesProps {
  totalCompleted: number;
  filteredTasksCount: number;
  onResetFilters: () => void;
}

export function CompletedTasksEmptyStates({
  totalCompleted,
  filteredTasksCount,
  onResetFilters
}: CompletedTasksEmptyStatesProps) {
  // No tasks completed yet
  if (totalCompleted === 0) {
    return (
      <Card className="p-8 text-center">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">Nenhuma tarefa concluída ainda</p>
        <p className="text-sm text-gray-500 mb-4">
          Complete algumas tarefas para começar a acompanhar seu progresso e gerar relatórios.
        </p>
        <Link to="/tasks/todo">
          <Button>
            Ver Tarefas Pendentes
          </Button>
        </Link>
      </Card>
    );
  }

  // Tasks exist but none match filters
  if (totalCompleted > 0 && filteredTasksCount === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-gray-500 mb-4">
          Ajuste os filtros para ver mais resultados ou limpe a busca.
        </p>
        <Button 
          variant="outline" 
          onClick={onResetFilters}
        >
          Limpar Filtros
        </Button>
      </Card>
    );
  }

  return null;
}
