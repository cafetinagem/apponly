
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskPageHeaderProps {
  title: string;
  filteredCount: number;
  totalCount: number;
  onCreateTask?: () => void;
  showCreateButton?: boolean;
  additionalInfo?: string;
}

export function TaskPageHeader({ 
  title, 
  filteredCount, 
  totalCount, 
  onCreateTask, 
  showCreateButton = false,
  additionalInfo 
}: TaskPageHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Mostrando {filteredCount} de {totalCount} tarefas
          </span>
          {additionalInfo && <span>{additionalInfo}</span>}
        </div>
      </div>
      
      {showCreateButton && onCreateTask && (
        <Button onClick={onCreateTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      )}
    </div>
  );
}
