
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskActionButtonsProps {
  task: Task;
  isProcessing: boolean;
  onTimerAction: (action: 'start' | 'pause' | 'stop' | 'resume') => Promise<void>;
  onStatusChange?: (newStatus: 'todo' | 'in-progress' | 'done') => void;
}

export function TaskActionButtons({ 
  task, 
  isProcessing, 
  onTimerAction, 
  onStatusChange 
}: TaskActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {task.status === 'todo' && (
        <Button
          size="sm"
          onClick={() => onTimerAction('start')}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <PlayCircle className="h-4 w-4" />
          {isProcessing ? 'Iniciando...' : 'Iniciar Tarefa'}
        </Button>
      )}
      
      {task.status === 'in-progress' && task.timerStatus === 'running' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTimerAction('pause')}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <PauseCircle className="h-4 w-4" />
            {isProcessing ? 'Pausando...' : 'Pausar'}
          </Button>
          <Button
            size="sm"
            onClick={() => onTimerAction('stop')}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircle className="h-4 w-4" />
            {isProcessing ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </>
      )}
      
      {task.status === 'in-progress' && task.timerStatus === 'paused' && (
        <>
          <Button
            size="sm"
            onClick={() => onTimerAction('resume')}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <PlayCircle className="h-4 w-4" />
            {isProcessing ? 'Retomando...' : 'Retomar'}
          </Button>
          <Button
            size="sm"
            onClick={() => onTimerAction('stop')}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircle className="h-4 w-4" />
            {isProcessing ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </>
      )}

      {task.status !== 'done' && onStatusChange && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatusChange('done')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4" />
          Marcar como Concluída
        </Button>
      )}
    </div>
  );
}
