
import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskEditModal } from './TaskEditModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Task } from '@/lib/types';
import { DashboardSkeleton } from '@/components/ui/skeleton-loader';

interface TaskListProps {
  status: 'todo' | 'in-progress' | 'done';
  title: string;
  description: string;
}

export function TaskList({ status, title, description }: TaskListProps) {
  const { tasks, loading, updateTask, deleteTask } = useTasks(status);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Filtrar tarefas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask({ id: taskId, updates: { status: newStatus } });
  };

  return (
    <div className="space-y-6">
      {/* Header da seção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-orange-600">
                {filteredTasks.length}
              </span>
              <span className="text-sm text-gray-500">
                {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="alta">Alta prioridade</SelectItem>
                <SelectItem value="media">Média prioridade</SelectItem>
                <SelectItem value="baixa">Baixa prioridade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tarefas */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || priorityFilter !== 'all' 
                ? 'Nenhuma tarefa encontrada com os filtros aplicados.'
                : `Nenhuma tarefa ${status === 'todo' ? 'pendente' : status === 'in-progress' ? 'em execução' : 'finalizada'} encontrada.`
              }
            </div>
            {(searchTerm || priorityFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setPriorityFilter('all');
                }}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Modal de edição */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => {
            updateTask({ id: editingTask.id, updates });
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
