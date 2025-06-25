
import { useState, useCallback } from 'react';

export function useTaskProcessing() {
  const [processingTasks, setProcessingTasks] = useState<Set<string>>(new Set());

  const setTaskProcessing = useCallback((taskId: string, isProcessing: boolean) => {
    setProcessingTasks(prev => {
      const newSet = new Set(prev);
      if (isProcessing) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  }, []);

  const isTaskProcessing = useCallback((taskId: string) => {
    return processingTasks.has(taskId);
  }, [processingTasks]);

  return {
    setTaskProcessing,
    isTaskProcessing
  };
}
