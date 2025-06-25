
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types';

interface TodoTasksKPIsProps {
  tasks: Task[];
}

export function TodoTasksKPIs({ tasks }: TodoTasksKPIsProps) {
  const highPriorityCount = tasks.filter(t => t.priority === 'alta').length;
  const withDeadlineCount = tasks.filter(t => t.deadline).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-600">Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <p className="text-xs text-gray-500">Tarefas a fazer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-600">Alta Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityCount}</div>
          <p className="text-xs text-gray-500">Urgentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-600">Com Prazo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withDeadlineCount}</div>
          <p className="text-xs text-gray-500">Têm deadline</p>
        </CardContent>
      </Card>
    </div>
  );
}
