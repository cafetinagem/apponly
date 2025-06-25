
import { useCallback } from 'react';
import { useTaskOperations } from '@/hooks/tasks/useTaskOperations';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';

export function useTimerOperations() {
  const { user } = useAuth();
  const { updateTask } = useTaskOperations(user);
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [queryClient]);

  const startTimer = useCallback(async (task: Task) => {
    const now = Date.now();
    console.log('⏰ [TimerOperations] Starting timer for task:', task.id);
    
    const result = await updateTask(task.id, {
      timerStatus: 'running',
      timerStartTime: now,
      status: 'in-progress'
    });
    
    if (result) {
      console.log('✅ [TimerOperations] Timer started successfully');
      invalidateQueries();
    }
    
    return result;
  }, [updateTask, invalidateQueries]);

  const pauseTimer = useCallback(async (task: Task) => {
    console.log('⏸️ [TimerOperations] Pausing timer for task:', task.id);
    
    if (task.timerStartTime) {
      const elapsedSinceStart = Date.now() - task.timerStartTime;
      const newElapsedTime = task.elapsedTime + elapsedSinceStart;
      
      const result = await updateTask(task.id, {
        timerStatus: 'paused',
        timerStartTime: undefined,
        elapsedTime: newElapsedTime
      });
      
      if (result) {
        console.log('✅ [TimerOperations] Timer paused successfully');
        invalidateQueries();
      }
      
      return result;
    }
  }, [updateTask, invalidateQueries]);

  const stopTimer = useCallback(async (task: Task) => {
    console.log('⏹️ [TimerOperations] Stopping timer for task:', task.id);
    
    let newElapsedTime = task.elapsedTime;
    
    if (task.timerStartTime) {
      const elapsedSinceStart = Date.now() - task.timerStartTime;
      newElapsedTime = task.elapsedTime + elapsedSinceStart;
    }
    
    const result = await updateTask(task.id, {
      timerStatus: 'idle',
      timerStartTime: undefined,
      elapsedTime: newElapsedTime,
      status: 'done',
      completedAt: new Date()
    });
    
    if (result) {
      console.log('✅ [TimerOperations] Timer stopped successfully');
      invalidateQueries();
    }
    
    return result;
  }, [updateTask, invalidateQueries]);

  const resumeTimer = useCallback(async (task: Task) => {
    const now = Date.now();
    console.log('▶️ [TimerOperations] Resuming timer for task:', task.id);
    
    const result = await updateTask(task.id, {
      timerStatus: 'running',
      timerStartTime: now
    });
    
    if (result) {
      console.log('✅ [TimerOperations] Timer resumed successfully');
      invalidateQueries();
    }
    
    return result;
  }, [updateTask, invalidateQueries]);

  return {
    startTimer,
    pauseTimer,
    stopTimer,
    resumeTimer
  };
}
