import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Calendar as CalendarIcon,
  PieChart,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function FinancialReportsPage() {
  const { sales, chatSales, models, loading } = useFinancialData();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [reportType, setReportType] = useState('monthly');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Calcular métricas dos relatórios
  const allSales = [...sales, ...chatSales];
  
  const filteredSales = allSales.filter(sale => {
    let matches = true;
    
    if (selectedModel !== 'all') {
      matches = matches && sale.model_id === selectedModel;
    }
    
    if (selectedPlatform !== 'all') {
      matches = matches && ('platform' in sale ? sale.platform === selectedPlatform : false);
    }
    
    if (dateRange.from) {
      matches = matches && new Date(sale.sale_date) >= dateRange.from;
    }
    
    if (dateRange.to) {
      matches = matches && new Date(sale.sale_date) <= dateRange.to;
    }
    
    return matches;
  });

  const reportMetrics = {
    totalRevenue: filteredSales.reduce((sum, sale) => {
      return sum + ('gross_amount' in sale ? sale.gross_amount : sale.total_amount);
    }, 0),
    totalSales: filteredSales.length,
    averageTicket: filteredSales.length > 0 ? 
      filteredSales.reduce((sum, sale) => {
        return sum + ('gross_amount' in sale ? sale.gross_amount : sale.total_amount);
      }, 0) / filteredSales.length : 0,
    adminEarnings: filteredSales.reduce((sum, sale) => sum + sale.admin_amount, 0),
    modelEarnings: filteredSales.reduce((sum, sale) => sum + sale.model_amount, 0),
    platformFees: filteredSales.reduce((sum, sale) => {
      return sum + ('platform_fee' in sale ? sale.platform_fee : 0);
    }, 0)
  };

  // Calcular crescimento (exemplo com dados do último período)
  const growthRate = 15.3; // Mock - seria calculado comparando períodos
  const salesGrowth = 8.7; // Mock

  // Distribuição por plataforma
  const platformDistribution = sales.reduce((acc, sale) => {
    const platform = sale.platform;
    if (!acc[platform]) {
      acc[platform] = { count: 0, revenue: 0 };
    }
    acc[platform].count++;
    acc[platform].revenue += sale.gross_amount;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  // Top modelos
  const modelPerformance = models.map(model => {
    const modelSales = filteredSales.filter(sale => sale.model_id === model.id);
    const revenue = modelSales.reduce((sum, sale) => {
      return sum + ('gross_amount' in sale ? sale.gross_amount : sale.total_amount);
    }, 0);
    
    return {
      id: model.id,
      name: model.name,
      sales: modelSales.length,
      revenue,
      earnings: modelSales.reduce((sum, sale) => sum + sale.model_amount, 0)
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const handleExportReport = () => {
    // Implementar exportação de relatório
    toast({
      title: "Exportando Relatório",
      description: "O relatório será baixado em breve...",
    });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                Relatórios Financeiros
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Análises detalhadas e insights do seu faturamento
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportReport}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros de Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Relatório</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as modelos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as modelos</SelectItem>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as plataformas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                      <SelectItem value="privacy">Privacy</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="chat">Chat Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                              {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                            </>
                          ) : (
                            format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                          )
                        ) : (
                          "Selecionar período"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange as any}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-100 text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(reportMetrics.totalRevenue)}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-300" />
                  <span className="text-sm text-blue-200">+{growthRate}% vs período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Total de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {reportMetrics.totalSales}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">+{salesGrowth}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(reportMetrics.averageTicket)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Por venda realizada
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Seus Ganhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(reportMetrics.adminEarnings)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {((reportMetrics.adminEarnings / reportMetrics.totalRevenue) * 100).toFixed(1)}% do total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e Análises */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Plataforma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-500" />
                  Distribuição por Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(platformDistribution).map(([platform, data]) => {
                    const percentage = (data.revenue / reportMetrics.totalRevenue) * 100;
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="font-medium capitalize">{platform}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(data.revenue)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {percentage.toFixed(1)}% • {data.count} vendas
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Modelos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Performance por Modelo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelPerformance.slice(0, 5).map((model, index) => (
                    <div key={model.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {model.sales} vendas
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(model.revenue)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Ganhos: {formatCurrency(model.earnings)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo Detalhado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Resumo Financeiro Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Receitas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Receita Bruta:</span>
                      <span className="font-semibold">{formatCurrency(reportMetrics.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Taxas de Plataforma:</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(reportMetrics.platformFees)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Receita Líquida:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(reportMetrics.totalRevenue - reportMetrics.platformFees)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Divisão</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Seus Ganhos:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(reportMetrics.adminEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ganhos das Modelos:</span>
                      <span className="font-semibold text-purple-600">{formatCurrency(reportMetrics.modelEarnings)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Distribuído:</span>
                      <span className="font-bold">
                        {formatCurrency(reportMetrics.adminEarnings + reportMetrics.modelEarnings)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Métricas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total de Vendas:</span>
                      <span className="font-semibold">{reportMetrics.totalSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ticket Médio:</span>
                      <span className="font-semibold">{formatCurrency(reportMetrics.averageTicket)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Modelos Ativas:</span>
                      <span className="font-semibold">{modelPerformance.filter(m => m.sales > 0).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 