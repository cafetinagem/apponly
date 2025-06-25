
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types';

interface InProgressTasksKPIsProps {
  tasks: Task[];
}

export function InProgressTasksKPIs({ tasks }: InProgressTasksKPIsProps) {
  const runningTasks = tasks.filter(task => task.timerStatus === 'running');
  const pausedTasks = tasks.filter(task => task.timerStatus === 'paused');
  const totalTimeSpent = tasks.reduce((acc, task) => acc + task.elapsedTime, 0);

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-600">Em Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className="text-xs text-gray-500">Tarefas ativas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-600">Em Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{runningTasks.length}</div>
          <p className="text-xs text-gray-500">Timer ativo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-600">Pausadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pausedTasks.length}</div>
          <p className="text-xs text-gray-500">Timer pausado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-600">Tempo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
          <p className="text-xs text-gray-500">Investido</p>
        </CardContent>
      </Card>
    </div>
  );
}
