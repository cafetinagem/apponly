
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  Calendar,
  User,
  Clock,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Task } from '@/lib/types';
import { TaskChecklist } from '@/components/TaskChecklist';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { DeleteTaskConfirmDialog } from '@/components/tasks/DeleteTaskConfirmDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompletedTasksListProps {
  tasks: Task[];
  onEdit: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function CompletedTasksList({ tasks, onEdit, onDelete }: CompletedTasksListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'baixa': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;

    setIsDeleting(true);
    try {
      await onDelete(deletingTask.id);
      toast({
        title: "Sucesso!",
        description: "Tarefa excluída com sucesso!"
      });
      setDeletingTask(null);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tarefa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-gray-500">
          Ajuste os filtros ou complete algumas tarefas para vê-las aqui.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 break-words">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 mb-3 break-words">{task.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    {task.assignee === 'executor' ? 'Executor' : 'Modelo'}
                  </Badge>
                  {task.platform && (
                    <Badge variant="outline">
                      {task.platform}
                    </Badge>
                  )}
                  <Badge className="bg-green-100 text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(task.elapsedTime)}
                  </Badge>
                </div>

                {/* Checklist */}
                {task.checklist.length > 0 && (
                  <div className="mb-3">
                    <TaskChecklist task={task} editable={false} />
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingTask(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteClick(task)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                Concluída em {task.completedAt ? 
                  format(new Date(task.completedAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 
                  'N/A'
                }
              </span>
            </div>
            <span>
              Criada em {format(new Date(task.createdAt), "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
        </Card>
      ))}

      {/* Dialog de Edição */}
      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSave={onEdit}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteTaskConfirmDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingTask?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
