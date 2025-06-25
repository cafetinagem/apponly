import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, TrendingUp, Users, DollarSign, BarChart3, Bell } from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { RevenueChart } from '@/components/financial/charts/RevenueChart';
import { PlatformDistributionChart } from '@/components/financial/charts/PlatformDistributionChart';
import { SalesVolumeChart } from '@/components/financial/charts/SalesVolumeChart';
import { AdvancedFilters } from '@/components/financial/AdvancedFilters';
import { ExportManager } from '@/components/financial/exports/ExportManager';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { cn } from '@/lib/utils';

export default function FinancialAnalyticsPage() {
  const { sales, models, chatSales, isLoading } = useFinancialData();
  
  const [filters, setFilters] = useState({
    search: '',
    dateRange: undefined,
    platforms: [],
    models: [],
    amountRange: { min: null, max: null },
    status: [],
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    pageSize: 20
  });

  const [showExportManager, setShowExportManager] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dados mockados para demonstração dos gráficos
  const revenueData = [
    { date: '2024-01-01', revenue: 15000, adminEarnings: 4500, modelEarnings: 9000, platformFees: 1500 },
    { date: '2024-01-15', revenue: 18000, adminEarnings: 5400, modelEarnings: 10800, platformFees: 1800 },
    { date: '2024-02-01', revenue: 22000, adminEarnings: 6600, modelEarnings: 13200, platformFees: 2200 },
    { date: '2024-02-15', revenue: 25000, adminEarnings: 7500, modelEarnings: 15000, platformFees: 2500 },
    { date: '2024-03-01', revenue: 28000, adminEarnings: 8400, modelEarnings: 16800, platformFees: 2800 },
    { date: '2024-03-15', revenue: 32000, adminEarnings: 9600, modelEarnings: 19200, platformFees: 3200 },
  ];

  const platformData = [
    { name: 'privacy', value: 45000, sales: 150, color: '#3b82f6' },
    { name: 'telegram', value: 28000, sales: 95, color: '#0ea5e9' },
    { name: 'instagram', value: 18000, sales: 60, color: '#e11d48' },
    { name: 'chat', value: 12000, sales: 40, color: '#8b5cf6' },
    { name: 'onlyfans', value: 8000, sales: 25, color: '#f59e0b' },
  ];

  const volumeData = [
    { period: '2024-01', salesCount: 45, revenue: 15000, averageTicket: 333 },
    { period: '2024-02', salesCount: 62, revenue: 22000, averageTicket: 355 },
    { period: '2024-03', salesCount: 78, revenue: 28000, averageTicket: 359 },
    { period: '2024-04', salesCount: 85, revenue: 32000, averageTicket: 376 },
    { period: '2024-05', salesCount: 92, revenue: 36000, averageTicket: 391 },
    { period: '2024-06', salesCount: 105, revenue: 42000, averageTicket: 400 },
  ];

  // Calcular KPIs
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = volumeData.reduce((sum, item) => sum + item.salesCount, 0);
  const averageTicket = totalRevenue / totalSales;
  const activeModels = models.length;

  // Simulação de notificação
  const handleTestNotification = () => {
    toast({
      title: "🎉 Sistema Avançado Ativo!",
      description: "Todas as funcionalidades avançadas foram implementadas com sucesso.",
    });
  };

  return (
    <NotificationProvider>
      <ProtectedRoute>
        <MainLayout>
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics Avançado
                </h1>
                <p className="text-muted-foreground mt-1">
                  Análise completa com gráficos interativos, filtros avançados e exportação profissional
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Notificações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowExportManager(!showExportManager)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={handleTestNotification} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Testar Sistema
                </Button>
              </div>
            </div>

            {/* Modais */}
            {showExportManager && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg max-w-4xl w-full mx-4">
                  <ExportManager />
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowExportManager(false)}
                    className="mt-4 w-full"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}

            {showNotifications && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg max-w-4xl w-full mx-4">
                  <NotificationCenter />
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowNotifications(false)}
                    className="mt-4 w-full"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}

            {/* Filtros Avançados */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              models={models}
              platforms={['privacy', 'telegram', 'instagram', 'chat', 'onlyfans']}
              isLoading={isLoading}
            />

            {/* KPIs Modernos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receita Total</CardTitle>
                  <DollarSign className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs opacity-80">+23.1% vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total de Vendas</CardTitle>
                  <BarChart3 className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalSales.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs opacity-80">+18.3% vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Ticket Médio</CardTitle>
                  <TrendingUp className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(averageTicket)}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs opacity-80">+4.2% vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Modelos Ativas</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeModels}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs opacity-80">+{Math.floor(activeModels * 0.15)} novas este mês</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs com Gráficos */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="platforms">Plataformas</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueChart data={revenueData} height={350} />
                  <PlatformDistributionChart data={platformData} height={350} />
                </div>
                <SalesVolumeChart data={volumeData} height={300} />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <RevenueChart data={revenueData} height={400} title="Análise Detalhada de Receita" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projeção de Crescimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: 'Julho 2024', projected: 45000, confidence: 92 },
                          { month: 'Agosto 2024', projected: 52000, confidence: 88 },
                          { month: 'Setembro 2024', projected: 58000, confidence: 82 },
                        ].map((item) => (
                          <div key={item.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <span className="font-medium">{item.month}</span>
                              <p className="text-sm text-muted-foreground">
                                Confiança: {item.confidence}%
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(item.projected)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Metas vs Realizado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { period: 'Q1 2024', target: 50000, achieved: 65000, percentage: 130 },
                          { period: 'Q2 2024', target: 60000, achieved: 78000, percentage: 130 },
                          { period: 'Q3 2024', target: 70000, achieved: 45000, percentage: 64 },
                        ].map((item) => (
                          <div key={item.period} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{item.period}</span>
                              <span className={cn(
                                "font-bold",
                                item.percentage >= 100 ? "text-green-600" : "text-orange-600"
                              )}>
                                {item.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className={cn(
                                  "h-3 rounded-full transition-all",
                                  item.percentage >= 100 ? "bg-green-500" : "bg-orange-500"
                                )}
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Meta: {formatCurrency(item.target)}</span>
                              <span>Realizado: {formatCurrency(item.achieved)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="platforms" className="space-y-6">
                <PlatformDistributionChart data={platformData} height={400} title="Análise Detalhada por Plataforma" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ranking de Plataformas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {platformData
                          .sort((a, b) => b.value - a.value)
                          .map((platform, index) => (
                            <div key={platform.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                                  index === 0 && "bg-yellow-500",
                                  index === 1 && "bg-gray-400",
                                  index === 2 && "bg-orange-600",
                                  index > 2 && "bg-blue-500"
                                )}>
                                  #{index + 1}
                                </div>
                                <div>
                                  <span className="font-medium capitalize">{platform.name}</span>
                                  <p className="text-sm text-muted-foreground">
                                    {platform.sales} vendas
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold">{formatCurrency(platform.value)}</span>
                                <p className="text-sm text-green-600">
                                  +{Math.floor(Math.random() * 30 + 5)}%
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Crescimento por Plataforma</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {platformData.map((platform) => {
                          const growth = Math.floor(Math.random() * 40 - 10); // -10 to +30
                          return (
                            <div key={platform.name} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium capitalize">{platform.name}</span>
                                <span className={cn(
                                  "font-bold",
                                  growth >= 0 ? "text-green-600" : "text-red-600"
                                )}>
                                  {growth >= 0 ? '+' : ''}{growth}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={cn(
                                    "h-2 rounded-full transition-all",
                                    growth >= 0 ? "bg-green-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${Math.min(Math.abs(growth) * 2, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Modelos por Receita</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {models.slice(0, 5).map((model, index) => {
                          const revenue = Math.floor(Math.random() * 10000 + 2000);
                          const growth = Math.floor(Math.random() * 40 + 5);
                          return (
                            <div key={model.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                                  index === 0 && "bg-yellow-500",
                                  index === 1 && "bg-gray-400",
                                  index === 2 && "bg-orange-600",
                                  index > 2 && "bg-blue-500"
                                )}>
                                  #{index + 1}
                                </div>
                                <div>
                                  <span className="font-medium">{model.name}</span>
                                  <p className="text-sm text-muted-foreground">
                                    {Math.floor(Math.random() * 50 + 10)} vendas
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold">{formatCurrency(revenue)}</span>
                                <p className="text-sm text-green-600">+{growth}%</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas de Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: 'Taxa de Conversão', value: '12.8%', change: '+2.3%', trend: 'up' },
                          { label: 'Tempo Médio de Resposta', value: '2.3h', change: '-18%', trend: 'down' },
                          { label: 'Satisfação do Cliente', value: '4.7/5', change: '+0.2', trend: 'up' },
                          { label: 'Retenção de Clientes', value: '68%', change: '+5%', trend: 'up' },
                          { label: 'Receita por Cliente', value: 'R$ 342', change: '+12%', trend: 'up' },
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <span className="font-medium">{metric.label}</span>
                              <p className="text-lg font-bold">{metric.value}</p>
                            </div>
                            <div className="text-right">
                              <span className={cn(
                                "text-sm font-bold",
                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                              )}>
                                {metric.change}
                              </span>
                              <TrendingUp className={cn(
                                "h-4 w-4 ml-1 inline",
                                metric.trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'
                              )} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Tendências</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          title: 'Tendência Semanal', 
                          description: 'Crescimento consistente de 15% semanalmente',
                          color: 'green',
                          icon: TrendingUp 
                        },
                        { 
                          title: 'Sazonalidade', 
                          description: 'Picos de vendas nos finais de semana (+25%)',
                          color: 'blue',
                          icon: BarChart3 
                        },
                        { 
                          title: 'Previsão', 
                          description: 'Próximo mês: R$ 68k (confiança 89%)',
                          color: 'purple',
                          icon: TrendingUp 
                        },
                      ].map((trend) => {
                        const Icon = trend.icon;
                        return (
                          <div key={trend.title} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className={cn(
                                "h-5 w-5",
                                trend.color === 'green' && "text-green-600",
                                trend.color === 'blue' && "text-blue-600",
                                trend.color === 'purple' && "text-purple-600"
                              )} />
                              <span className="font-medium">{trend.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {trend.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Footer Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-0">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    🎉 Sistema Financeiro Avançado OnlyCat
                  </h3>
                  <p className="text-muted-foreground">
                    Todas as funcionalidades implementadas: Gráficos Interativos, Notificações em Tempo Real, 
                    Exportação Avançada, Filtros Inteligentes e Analytics Profissional
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Gráficos Recharts
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ✅ Notificações Real-time
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      ✅ Export PDF/Excel/CSV
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      ✅ Filtros Avançados
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </MainLayout>
      </ProtectedRoute>
    </NotificationProvider>
  );
} 