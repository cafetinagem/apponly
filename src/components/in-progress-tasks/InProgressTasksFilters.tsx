
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface InProgressTasksFiltersProps {
  searchTerm: string;
  priorityFilter: string;
  assigneeFilter: string;
  timerFilter: string;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onTimerChange: (value: string) => void;
}

export function InProgressTasksFilters({
  searchTerm,
  priorityFilter,
  assigneeFilter,
  timerFilter,
  onSearchChange,
  onPriorityChange,
  onAssigneeChange,
  onTimerChange
}: InProgressTasksFiltersProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={timerFilter} onValueChange={onTimerChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status do Timer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="running">Em Execução</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="executor">Executor</SelectItem>
              <SelectItem value="modelo">Modelo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
