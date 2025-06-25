import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, Table, File } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { exportToPDF } from '@/lib/exportUtils';
import { exportToExcel } from '@/lib/exportUtils';
import { exportToCSV } from '@/lib/exportUtils';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { DateRange } from 'react-day-picker';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: DateRange | undefined;
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetailed: boolean;
  groupBy: 'model' | 'platform' | 'date' | 'none';
  models: string[];
  platforms: string[];
}

export function ExportManager() {
  const { sales, models } = useFinancialData();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: undefined,
    includeCharts: true,
    includeSummary: true,
    includeDetailed: true,
    groupBy: 'date',
    models: [],
    platforms: []
  });

  const platforms = ['privacy', 'telegram', 'instagram', 'chat', 'onlyfans'];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Filter data based on options
      let filteredSales = [...sales];
      
      if (options.dateRange?.from && options.dateRange?.to) {
        filteredSales = filteredSales.filter(sale => {
          const saleDate = new Date(sale.created_at);
          return saleDate >= options.dateRange!.from! && saleDate <= options.dateRange!.to!;
        });
      }

      if (options.models.length > 0) {
        filteredSales = filteredSales.filter(sale => 
          options.models.includes(sale.model_id)
        );
      }

      if (options.platforms.length > 0) {
        filteredSales = filteredSales.filter(sale => 
          options.platforms.includes(sale.platform)
        );
      }

      const exportData = {
        sales: filteredSales,
        models,
        options,
        summary: {
          totalSales: filteredSales.length,
                     totalRevenue: filteredSales.reduce((sum, sale) => sum + (sale.amount || 0), 0),
           averageTicket: filteredSales.reduce((sum, sale) => sum + (sale.amount || 0), 0) / filteredSales.length || 0,
          topModel: models.find(m => 
            m.id === filteredSales
              .reduce((acc, sale) => {
                acc[sale.model_id] = (acc[sale.model_id] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
              ? Object.entries(filteredSales.reduce((acc, sale) => {
                  acc[sale.model_id] = (acc[sale.model_id] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>))
                .sort(([,a], [,b]) => b - a)[0]?.[0]
              : ''
          )?.name || 'N/A'
        }
      };

      switch (options.format) {
        case 'pdf':
          await exportToPDF(exportData);
          break;
        case 'excel':
          await exportToExcel(exportData);
          break;
        case 'csv':
          await exportToCSV(exportData);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      // Here you could show a toast notification
    } finally {
      setIsExporting(false);
    }
  };

  const getExportIcon = () => {
    switch (options.format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <Table className="h-4 w-4" />;
      case 'csv':
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={options.format} onValueChange={(value) => 
          setOptions(prev => ({ ...prev, format: value as 'pdf' | 'excel' | 'csv' }))
        }>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Excel
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              CSV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={options.format} className="space-y-4 mt-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !options.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {options.dateRange?.from ? (
                      options.dateRange.to ? (
                        <>
                          {format(options.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(options.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(options.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={options.dateRange?.from}
                    selected={options.dateRange}
                    onSelect={(range) => setOptions(prev => ({ ...prev, dateRange: range }))}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Content Options */}
            {options.format === 'pdf' && (
              <div className="space-y-3">
                <Label>Conteúdo do Relatório</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={options.includeCharts}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeCharts: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeCharts">Incluir gráficos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={options.includeSummary}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeSummary: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeSummary">Incluir resumo executivo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeDetailed"
                      checked={options.includeDetailed}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, includeDetailed: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeDetailed">Incluir dados detalhados</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Group By */}
            <div className="space-y-2">
              <Label>Agrupar por</Label>
              <Select value={options.groupBy} onValueChange={(value) => 
                setOptions(prev => ({ ...prev, groupBy: value as typeof options.groupBy }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem agrupamento</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="model">Modelo</SelectItem>
                  <SelectItem value="platform">Plataforma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modelos</Label>
                <Select value={options.models.join(',')} onValueChange={(value) => 
                  setOptions(prev => ({ ...prev, models: value ? value.split(',') : [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as modelos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as modelos</SelectItem>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plataformas</Label>
                <Select value={options.platforms.join(',')} onValueChange={(value) => 
                  setOptions(prev => ({ ...prev, platforms: value ? value.split(',') : [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as plataformas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as plataformas</SelectItem>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {getExportIcon()}
          {isExporting ? 'Exportando...' : `Exportar como ${options.format.toUpperCase()}`}
        </Button>
      </CardContent>
    </Card>
  );
} 