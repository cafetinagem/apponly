
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Task } from '@/lib/types';
import { useTaskTimer } from '@/hooks/useTaskTimer';

interface TaskTimerProps {
  task: Task;
  compact?: boolean;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({ task, compact = false }) => {
  const { startTimer, pauseTimer, stopTimer, resumeTimer, getCurrentElapsedTime, isTaskProcessing } = useTaskTimer();
  const [currentElapsedTime, setCurrentElapsedTime] = useState(getCurrentElapsedTime(task));

  const isProcessing = isTaskProcessing(task.id);

  // Update elapsed time every second for running tasks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (task.timerStatus === 'running' && task.timerStartTime) {
      interval = setInterval(() => {
        setCurrentElapsedTime(getCurrentElapsedTime(task));
      }, 1000);
    } else {
      setCurrentElapsedTime(task.elapsedTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.timerStatus, task.timerStartTime, task.elapsedTime, getCurrentElapsedTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimerAction = async (action: 'start' | 'pause' | 'stop' | 'resume') => {
    if (isProcessing) {
      console.log(`⏳ [TaskTimer] Ação ${action} ignorada - tarefa em processamento`);
      return;
    }
    
    console.log(`🎯 [TaskTimer] ===== EXECUTANDO AÇÃO: ${action.toUpperCase()} =====`);
    console.log('📋 [TaskTimer] Tarefa:', task.id, '-', task.title);
    
    try {
      let result;
      switch (action) {
        case 'start':
          result = await startTimer(task);
          break;
        case 'pause':
          result = await pauseTimer(task);
          break;
        case 'stop':
          result = await stopTimer(task);
          break;
        case 'resume':
          result = await resumeTimer(task);
          break;
      }
      
      if (result) {
        console.log(`✅ [TaskTimer] Ação ${action} concluída com sucesso`);
      } else {
        console.error(`❌ [TaskTimer] Falha na ação ${action}`);
      }
    } catch (error) {
      console.error(`💥 [TaskTimer] Erro na ação ${action}:`, error);
    }
  };

  if (compact) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {formatTime(currentElapsedTime)}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {formatTime(currentElapsedTime)}
        {task.timerStatus === 'running' && (
          <span className="ml-1 text-green-600">●</span>
        )}
      </div>
      
      {task.status === 'todo' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTimerAction('start')}
          disabled={isProcessing}
          className="flex items-center gap-1"
        >
          <Play className="h-3 w-3" />
          {isProcessing ? 'Iniciando...' : 'Iniciar'}
        </Button>
      )}
      
      {task.status === 'in-progress' && task.timerStatus === 'running' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTimerAction('pause')}
            disabled={isProcessing}
            className="flex items-center gap-1"
          >
            <Pause className="h-3 w-3" />
            {isProcessing ? 'Pausando...' : 'Pausar'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTimerAction('stop')}
            disabled={isProcessing}
            className="flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            <Square className="h-3 w-3" />
            {isProcessing ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </>
      )}
      
      {task.status === 'in-progress' && task.timerStatus === 'paused' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTimerAction('resume')}
            disabled={isProcessing}
            className="flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            {isProcessing ? 'Retomando...' : 'Retomar'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTimerAction('stop')}
            disabled={isProcessing}
            className="flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            <Square className="h-3 w-3" />
            {isProcessing ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </>
      )}
      
      {task.status === 'done' && (
        <Badge className="bg-green-100 text-green-800">
          Concluída
        </Badge>
      )}
    </div>
  );
};
