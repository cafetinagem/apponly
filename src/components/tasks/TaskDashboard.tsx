
import React from 'react';
import { useAllTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Play, BarChart3 } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/skeleton-loader';

export const TaskDashboard = React.memo(function TaskDashboard() {
  const { tasks, loading } = useAllTasks();

  if (loading) {
    return <DashboardSkeleton />;
  }

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'done');

  const stats = [
    {
      title: 'A Fazer',
      value: todoTasks.length,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'Em Execução',
      value: inProgressTasks.length,
      icon: Play,
      color: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-800'
    },
    {
      title: 'Finalizadas',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'text-black dark:text-white',
      borderColor: 'border-gray-300 dark:border-gray-700'
    },
    {
      title: 'Total',
      value: tasks.length,
      icon: BarChart3,
      color: 'text-orange-500 dark:text-orange-400',
      borderColor: 'border-orange-300 dark:border-orange-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.borderColor} bg-white dark:bg-gray-900`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-orange-600 dark:text-orange-400">
              Próximas Tarefas
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Tarefas pendentes com maior prioridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todoTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma tarefa pendente
              </p>
            ) : (
              todoTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="mb-2 last:mb-0 p-2 rounded border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{task.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Prioridade: {task.priority}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-300">
              Em Andamento
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Tarefas sendo executadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inProgressTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma tarefa em execução
              </p>
            ) : (
              inProgressTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="mb-2 last:mb-0 p-2 rounded border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{task.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {task.assignee === 'executor' ? 'Executor' : 'Modelo'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-black dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              Recém Finalizadas
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Últimas tarefas completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma tarefa finalizada
              </p>
            ) : (
              completedTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="mb-2 last:mb-0 p-2 rounded border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{task.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {task.completedAt?.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
