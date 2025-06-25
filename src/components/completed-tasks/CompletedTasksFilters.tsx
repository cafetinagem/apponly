
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, CalendarIcon, Download, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CompletedTasksFilters as FiltersType } from '@/hooks/tasks/useCompletedTasksLogic';

interface CompletedTasksFiltersProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onReset: () => void;
  taskCount: number;
}

export function CompletedTasksFilters({
  filters,
  setFilters,
  onExportCSV,
  onExportJSON,
  onReset,
  taskCount
}: CompletedTasksFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar tarefas concluídas..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={onExportJSON}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Relatório JSON
          </Button>
          
          <Button
            variant="destructive"
            onClick={onReset}
            className="flex items-center gap-2"
            disabled={taskCount === 0}
          >
            <RotateCcw className="h-4 w-4" />
            Resetar Todas
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select 
          value={filters.assignee || "all"} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, assignee: value === "all" ? "" : value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 z-50">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="executor">Executor</SelectItem>
            <SelectItem value="modelo">Modelo</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.platform || "all"} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value === "all" ? "" : value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 z-50">
            <SelectItem value="all">Todas as plataformas</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="privacy">Privacy</SelectItem>
            <SelectItem value="onlyfans">OnlyFans</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? format(filters.dateRange.from, 'dd/MM/yyyy', { locale: ptBR }) : 'Data início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 z-50">
              <Calendar
                mode="single"
                selected={filters.dateRange.from}
                onSelect={(date) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, from: date } 
                }))}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM/yyyy', { locale: ptBR }) : 'Data fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 z-50">
              <Calendar
                mode="single"
                selected={filters.dateRange.to}
                onSelect={(date) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, to: date } 
                }))}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
