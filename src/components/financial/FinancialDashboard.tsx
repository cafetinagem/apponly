import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  TrendingUp,
  Users,
  PieChart,
  BarChart3,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';

export function FinancialDashboard() {
  const { dashboardData, loading, refreshAll } = useFinancialData();

  if (loading || !dashboardData) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const growthRate = 12.5; // Calcular baseado em dados históricos
  const conversionRate = 85.2; // Taxa de conversão de leads

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral das vendas e ganhos das suas modelos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshAll}
            variant="outline"
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Total */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-100 text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(dashboardData.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpIcon className="h-3 w-3" />
              <span className="text-sm text-orange-100">
                +{growthRate}% este mês
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ganhos Admin */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Seus Ganhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(dashboardData.adminEarnings)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {((dashboardData.adminEarnings / dashboardData.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>

        {/* Ganhos das Modelos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Ganhos das Modelos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(dashboardData.modelEarnings)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {((dashboardData.modelEarnings / dashboardData.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>

        {/* Taxas das Plataformas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-red-500" />
              Taxas das Plataformas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(dashboardData.platformFees)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {((dashboardData.platformFees / dashboardData.totalRevenue) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Vendas Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{dashboardData.salesCount}</div>
            <Progress value={conversionRate} className="h-2 mb-2" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {conversionRate}% de conversão
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Melhor Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold mb-1">{dashboardData.topModel.name}</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatCurrency(dashboardData.topModel.earnings)}
            </div>
            <Badge variant="secondary">Top Performer</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Plataforma Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-semibold mb-1">{dashboardData.topPlatform.name}</div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(dashboardData.topPlatform.revenue)}
            </div>
            <Badge variant="outline">Mais Rentável</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Vendas Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              Vendas Recentes
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboardData.recentSales.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentSales.map((sale) => (
                <div 
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{sale.platform}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatCurrency(sale.gross_amount)}
                    </div>
                    <Badge 
                      variant={sale.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {sale.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma venda registrada ainda
              </p>
              <Button className="mt-3 bg-orange-500 hover:bg-orange-600">
                Registrar Primeira Venda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Venda Manual</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
        >
          <Users className="h-5 w-5" />
          <span>Configurar Modelo</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Relatórios</span>
        </Button>
      </div>
    </div>
  );
} 