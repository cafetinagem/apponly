
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { 
  Calendar, 
  Clock, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle,
  PlayCircle,
  PauseCircle,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
            {showActions && (
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
                  {task.status !== 'todo' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                      <Clock className="h-4 w-4 mr-2" />
                      Marcar como Pendente
                    </DropdownMenuItem>
                  )}
                  {task.status !== 'in-progress' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Iniciar Tarefa
                    </DropdownMenuItem>
                  )}
                  {task.status !== 'done' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Concluir
                    </DropdownMenuItem>
                  )}
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

          <div className="space-y-2">
            {task.assignee && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3 shrink-0" />
                <span className="truncate">{task.assignee}</span>
              </div>
            )}

            {task.platform && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 bg-orange-500 rounded-full shrink-0"></span>
                <span className="truncate">{task.platform}</span>
              </div>
            )}

            {task.deadline && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="truncate">{formatDate(task.deadline)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Prazo final</p>
                </TooltipContent>
              </Tooltip>
            )}

            {task.timeEstimate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="truncate">{formatTime(task.timeEstimate)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tempo estimado</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

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
