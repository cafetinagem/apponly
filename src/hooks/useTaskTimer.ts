
import { useCallback } from 'react';
import { Task } from '@/lib/types';
import { useTimerOperations } from './useTimerOperations';
import { useTaskProcessing } from './useTaskProcessing';

export function useTaskTimer() {
  const { startTimer: startOp, pauseTimer: pauseOp, stopTimer: stopOp, resumeTimer: resumeOp } = useTimerOperations();
  const { setTaskProcessing, isTaskProcessing } = useTaskProcessing();

  const executeTimerAction = useCallback(async (
    task: Task, 
    action: 'start' | 'pause' | 'stop' | 'resume',
    operation: () => Promise<any>
  ) => {
    if (isTaskProcessing(task.id)) return null;
    
    setTaskProcessing(task.id, true);
    
    try {
      const result = await operation();
      if (result) {
        console.log(`✅ [TaskTimer] ${action} completed successfully`);
      } else {
        console.error(`❌ [TaskTimer] ${action} failed`);
      }
      return result;
    } catch (error) {
      console.error(`💥 [TaskTimer] Error in ${action}:`, error);
      return null;
    } finally {
      setTaskProcessing(task.id, false);
    }
  }, [isTaskProcessing, setTaskProcessing]);

  const startTimer = useCallback(async (task: Task) => {
    return executeTimerAction(task, 'start', () => startOp(task));
  }, [executeTimerAction, startOp]);

  const pauseTimer = useCallback(async (task: Task) => {
    return executeTimerAction(task, 'pause', () => pauseOp(task));
  }, [executeTimerAction, pauseOp]);

  const stopTimer = useCallback(async (task: Task) => {
    return executeTimerAction(task, 'stop', () => stopOp(task));
  }, [executeTimerAction, stopOp]);

  const resumeTimer = useCallback(async (task: Task) => {
    return executeTimerAction(task, 'resume', () => resumeOp(task));
  }, [executeTimerAction, resumeOp]);

  const getCurrentElapsedTime = useCallback((task: Task) => {
    if (task.timerStatus === 'running' && task.timerStartTime) {
      const currentTime = Date.now();
      return task.elapsedTime + (currentTime - task.timerStartTime);
    }
    return task.elapsedTime;
  }, []);

  return {
    startTimer,
    pauseTimer,
    stopTimer,
    resumeTimer,
    getCurrentElapsedTime,
    isTaskProcessing
  };
}
