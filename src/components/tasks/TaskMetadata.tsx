
import React from 'react';
import { 
  Calendar, 
  Clock, 
  User
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Task } from '@/lib/types';

interface TaskMetadataProps {
  task: Task;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-2">
      {task.assignee && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{task.assignee === 'executor' ? 'Executor' : 'Modelo'}</span>
        </div>
      )}

      {task.platform && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 bg-orange-500 rounded-full shrink-0"></span>
          <span className="truncate">{task.platform}</span>
        </div>
      )}

      {task.deadline && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{formatDate(task.deadline)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Prazo final</p>
          </TooltipContent>
        </Tooltip>
      )}

      {task.timeEstimate && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{task.timeEstimate} min</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tempo estimado</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
