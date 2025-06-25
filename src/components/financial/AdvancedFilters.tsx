import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  CalendarIcon, 
  X, 
  Search, 
  RotateCcw,
  ChevronDown,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface FilterState {
  search: string;
  dateRange: DateRange | undefined;
  platforms: string[];
  models: string[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  status: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  models: Array<{ id: string; name: string }>;
  platforms: string[];
  isLoading?: boolean;
}

export function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  models, 
  platforms, 
  isLoading = false 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'platforms' | 'models' | 'status', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: undefined,
      platforms: [],
      models: [],
      amountRange: { min: null, max: null },
      status: [],
      sortBy: 'created_at',
      sortOrder: 'desc',
      pageSize: 20
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.platforms.length > 0) count++;
    if (filters.models.length > 0) count++;
    if (filters.amountRange.min !== null || filters.amountRange.max !== null) count++;
    if (filters.status.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              {isExpanded ? 'Menos' : 'Mais'} Opções
              <ChevronDown className={cn(
                "h-3 w-3 ml-1 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por modelo, observações..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd/MM", { locale: ptBR })} -{" "}
                        {format(filters.dateRange.to, "dd/MM", { locale: ptBR })}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => updateFilter('dateRange', range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Platform Filter */}
          <div className="space-y-2">
            <Label>Plataformas ({filters.platforms.length})</Label>
            <Select onValueChange={(value) => toggleArrayFilter('platforms', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={filters.platforms.includes(platform)}
                        onChange={() => {}} // controlled by SelectItem
                      />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Filter */}
          <div className="space-y-2">
            <Label>Modelos ({filters.models.length})</Label>
            <Select onValueChange={(value) => toggleArrayFilter('models', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar modelo" />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={filters.models.includes(model.id)}
                        onChange={() => {}} // controlled by SelectItem
                      />
                      {model.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.platforms.map(platform => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('platforms', platform)}
                />
              </Badge>
            ))}
            {filters.models.map(modelId => {
              const model = models.find(m => m.id === modelId);
              return (
                <Badge key={modelId} variant="secondary" className="flex items-center gap-1">
                  {model?.name || modelId}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('models', modelId)}
                  />
                </Badge>
              );
            })}
            {filters.dateRange?.from && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.dateRange.to ? (
                  `${format(filters.dateRange.from, "dd/MM", { locale: ptBR })} - ${format(filters.dateRange.to, "dd/MM", { locale: ptBR })}`
                ) : (
                  format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                )}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('dateRange', undefined)}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount Range */}
              <div className="space-y-2">
                <Label>Faixa de Valores</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.amountRange.min ?? ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      min: e.target.value ? Number(e.target.value) : null
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.amountRange.max ?? ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      max: e.target.value ? Number(e.target.value) : null
                    })}
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <Label>Ordenação</Label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Data</SelectItem>
                      <SelectItem value="amount">Valor</SelectItem>
                      <SelectItem value="platform">Plataforma</SelectItem>
                      <SelectItem value="model_name">Modelo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Desc</SelectItem>
                      <SelectItem value="asc">Asc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <Label>Itens por página</Label>
                <Select value={filters.pageSize.toString()} onValueChange={(value) => updateFilter('pageSize', Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 