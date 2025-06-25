
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResponsiveTable } from '@/components/responsive/ResponsiveTable';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Square,
  Clock
} from 'lucide-react';
import { useTaskTimer } from '@/hooks/useTaskTimer';

interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showTimer?: boolean;
}

export function TaskTable({ tasks, onEdit, onDelete, showTimer = true }: TaskTableProps) {
  const { startTimer, pauseTimer, stopTimer, resumeTimer, getCurrentElapsedTime } = useTaskTimer();

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'baixa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'A Fazer';
      case 'in-progress': return 'Em Progresso';
      case 'done': return 'Concluída';
      default: return status;
    }
  };

  const handleTimerAction = async (task: Task, action: 'start' | 'pause' | 'stop' | 'resume') => {
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
      console.error('Error updating timer:', error);
    }
  };

  return (
    <ResponsiveTable minWidth="700px">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] sm:w-[250px]">Título</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Prioridade</TableHead>
            <TableHead className="hidden lg:table-cell">Responsável</TableHead>
            {showTimer && <TableHead className="hidden xl:table-cell">Tempo</TableHead>}
            <TableHead className="hidden lg:table-cell">Prazo</TableHead>
            <TableHead className="w-[60px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="min-w-0">
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base break-words">{task.title}</div>
                  {task.description && (
                    <div className="text-xs sm:text-sm text-muted-foreground break-words line-clamp-2">
                      {task.description}
                    </div>
                  )}
                  {/* Mobile-only info */}
                  <div className="sm:hidden flex flex-wrap gap-1 mt-2">
                    <Badge className={getStatusColor(task.status)} variant="secondary">
                      {getStatusLabel(task.status)}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {task.assignee === 'executor' ? 'Executor' : 'Modelo'}
              </TableCell>
              {showTimer && (
                <TableCell className="hidden xl:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm">
                      {formatTime(getCurrentElapsedTime(task))}
                    </span>
                    {task.status !== 'done' && (
                      <div className="flex gap-1">
                        {task.status === 'todo' && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleTimerAction(task, 'start')}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {task.status === 'in-progress' && task.timerStatus === 'running' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTimerAction(task, 'pause')}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTimerAction(task, 'stop')}
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {task.status === 'in-progress' && task.timerStatus === 'paused' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTimerAction(task, 'resume')}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleTimerAction(task, 'stop')}
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
              )}
              <TableCell className="hidden lg:table-cell text-sm">
                {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit?.(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(task.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveTable>
  );
}
