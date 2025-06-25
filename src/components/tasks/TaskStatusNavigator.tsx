
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAllTasks } from '@/hooks/useTasks';

export function TaskStatusNavigator() {
  const location = useLocation();
  const { tasks } = useAllTasks();

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'done').length;

  const navigationItems = [
    {
      label: 'A Fazer',
      description: 'Criar e gerenciar tarefas',
      icon: CheckSquare,
      path: '/tasks/todo',
      count: todoCount,
      color: 'bg-blue-500',
    },
    {
      label: 'Em Execução',
      description: 'Tarefas em andamento com timer',
      icon: Clock,
      path: '/tasks/in-progress',
      count: inProgressCount,
      color: 'bg-orange-500',
    },
    {
      label: 'Finalizadas',
      description: 'Tarefas concluídas',
      icon: CheckCircle,
      path: '/tasks/completed',
      count: completedCount,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="bg-card rounded-lg p-6 border mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Fluxo de Trabalho das Tarefas
      </h2>
      
      {/* Flow visualization */}
      <div className="flex items-center justify-center mb-6 overflow-x-auto">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={item.path}>
              <div className="flex flex-col items-center min-w-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                  isActive 
                    ? `${item.color} shadow-lg` 
                    : "bg-gray-200 dark:bg-gray-700"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                  )} />
                </div>
                <span className={cn(
                  "text-sm font-medium text-center",
                  isActive 
                    ? "text-orange-600 dark:text-orange-400" 
                    : "text-gray-600 dark:text-gray-400"
                )}>
                  {item.label}
                </span>
                <Badge variant={isActive ? "default" : "outline"} className="mt-1">
                  {item.count}
                </Badge>
              </div>
              
              {index < navigationItems.length - 1 && (
                <ArrowRight className="h-5 w-5 mx-4 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col p-4 rounded-lg border transition-all hover:shadow-md group",
                isActive 
                  ? "bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-600" 
                  : "bg-card hover:bg-accent border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    isActive ? item.color : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
                    )} />
                  </div>
                  <div>
                    <span className={cn(
                      "font-medium",
                      isActive 
                        ? "text-orange-700 dark:text-orange-100" 
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </div>
                <Badge variant={isActive ? "secondary" : "outline"}>
                  {item.count}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
