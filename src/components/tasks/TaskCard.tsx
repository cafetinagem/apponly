
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { 
  Edit, 
  Trash2, 
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTaskTimer } from '@/hooks/useTaskTimer';
import { TimerDisplay } from './TimerDisplay';
import { TaskActionButtons } from './TaskActionButtons';
import { TaskMetadata } from './TaskMetadata';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: 'todo' | 'in-progress' | 'done') => void;
  showActions?: boolean;
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  showActions = true 
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { startTimer, pauseTimer, stopTimer, resumeTimer, getCurrentElapsedTime, isTaskProcessing } = useTaskTimer();

  const isProcessing = isTaskProcessing(task.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'done': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const handleTimerAction = async (action: 'start' | 'pause' | 'stop' | 'resume') => {
    if (isProcessing) return;
    
    try {
      switch (action) {
        case 'start':
          await startTimer(task);
          break;
        case 'pause':
          await pauseTimer(task);
          break;
        case 'stop':
          await stopTimer(task);
          break;
        case 'resume':
          await resumeTimer(task);
          break;
      }
    } catch (error) {
      console.error(`Erro na ação ${action}:`, error);
    }
  };

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done') => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "h-full transition-all duration-200 hover:shadow-lg border-2",
          "bg-white dark:bg-gray-800",
          isHovered ? "border-orange-300 dark:border-orange-600" : "border-gray-200 dark:border-gray-700"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base line-clamp-2 flex-1">
              {task.title}
            </h3>
            {showActions && onEdit && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(task.status)} variant="outline">
              {task.status === 'todo' && 'Pendente'}
              {task.status === 'in-progress' && 'Em Progresso'}
              {task.status === 'done' && 'Concluída'}
            </Badge>
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              Prioridade {task.priority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {task.description}
            </p>
          )}

          <TaskMetadata task={task} />

          <TimerDisplay task={task} getCurrentElapsedTime={getCurrentElapsedTime} />

          <TaskActionButtons 
            task={task}
            isProcessing={isProcessing}
            onTimerAction={handleTimerAction}
            onStatusChange={handleStatusChange}
          />

          {task.checklist && task.checklist.length > 0 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Checklist: {task.checklist.filter(item => item.completed).length}/{task.checklist.length} itens
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
