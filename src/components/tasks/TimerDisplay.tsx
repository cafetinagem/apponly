
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Task } from '@/lib/types';

interface TimerDisplayProps {
  task: Task;
  getCurrentElapsedTime: (task: Task) => number;
}

export function TimerDisplay({ task, getCurrentElapsedTime }: TimerDisplayProps) {
  const [currentElapsedTime, setCurrentElapsedTime] = useState(getCurrentElapsedTime(task));

  useEffect(() => {
    if (task.timerStatus === 'running') {
      const interval = setInterval(() => {
        setCurrentElapsedTime(getCurrentElapsedTime(task));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentElapsedTime(task.elapsedTime);
    }
  }, [task.timerStatus, task.timerStartTime, task.elapsedTime, getCurrentElapsedTime]);

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!(task.status === 'in-progress' || task.elapsedTime > 0)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
      <Clock className="h-4 w-4" />
      <span>{formatTime(currentElapsedTime)}</span>
      {task.timerStatus === 'running' && (
        <span className="text-green-600 animate-pulse">●</span>
      )}
    </div>
  );
}
