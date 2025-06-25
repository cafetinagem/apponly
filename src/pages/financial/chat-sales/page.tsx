import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { ChatSalesTable } from '@/components/financial/ChatSalesTable';
import { CreateChatSaleDialog } from '@/components/financial/CreateChatSaleDialog';
import { ChatSalesConfigDialog } from '@/components/financial/ChatSalesConfigDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Settings2, 
  TrendingUp,
  DollarSign,
  Users,
  Target
} from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { ChatSale, ChatSalesConfig } from '@/types/financial';

export default function ChatSalesPage() {
  const { chatSales, chatSalesConfigs, dashboardData, loading } = useFinancialData();
  const [createSaleDialogOpen, setCreateSaleDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ChatSalesConfig | null>(null);
  const [editingSale, setEditingSale] = useState<ChatSale | null>(null);

  // Calcular estatísticas das vendas de chat
  const chatStats = {
    totalRevenue: chatSales.reduce((sum, sale) => sum + sale.total_amount, 0),
    totalSales: chatSales.length,
    adminEarnings: chatSales.reduce((sum, sale) => sum + sale.admin_amount, 0),
    modelEarnings: chatSales.reduce((sum, sale) => sum + sale.model_amount, 0),
    averageTicket: chatSales.length > 0 ? 
      chatSales.reduce((sum, sale) => sum + sale.total_amount, 0) / chatSales.length : 0
  };

  const handleCreateSale = () => {
    setCreateSaleDialogOpen(true);
  };

  const handleConfigService = () => {
    setEditingConfig(null);
    setConfigDialogOpen(true);
  };

  const handleEditConfig = (config: ChatSalesConfig) => {
    setEditingConfig(config);
    setConfigDialogOpen(true);
  };

  const handleEditSale = (sale: ChatSale) => {
    setEditingSale(sale);
    setCreateSaleDialogOpen(true);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-orange-500" />
                Vendas de Chat
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie vendas personalizadas e serviços de chat
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleConfigService}
                variant="outline"
                className="gap-2"
              >
                <Settings2 className="h-4 w-4" />
                Configurar Serviço
              </Button>
              <Button 
                onClick={handleCreateSale}
                className="gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-100 text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(chatStats.totalRevenue)}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Total de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {chatStats.totalSales}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Seus Ganhos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(chatStats.adminEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Ganhos das Modelos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(chatStats.modelEarnings)}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-500" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(chatStats.averageTicket)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configurações de Serviços */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-orange-500" />
                  Serviços Configurados ({chatSalesConfigs.length})
                </CardTitle>
                <Button 
                  onClick={handleConfigService}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Novo Serviço
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {chatSalesConfigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chatSalesConfigs.map((config) => (
                    <Card key={config.id} className="border-2 hover:border-orange-200 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{config.service_name}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {config.description || 'Sem descrição'}
                            </p>
                          </div>
                          <Badge variant={config.is_active ? 'default' : 'secondary'}>
                            {config.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Preço Base:</span>
                            <span className="font-semibold">{formatCurrency(config.base_price)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Sua %:</span>
                            <span className="font-semibold text-green-600">{config.admin_percentage}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">% Modelo:</span>
                            <span className="font-semibold text-purple-600">{config.model_percentage}%</span>
                          </div>
                          <Button 
                            onClick={() => handleEditConfig(config)}
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3"
                          >
                            Editar Configuração
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Nenhum serviço configurado
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Configure serviços personalizados para gerenciar percentuais
                  </p>
                  <Button 
                    onClick={handleConfigService}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Configurar Primeiro Serviço
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabela de Vendas de Chat */}
          <ChatSalesTable
            onCreateSale={handleCreateSale}
            onEditSale={handleEditSale}
          />

          {/* Dialogs */}
          <CreateChatSaleDialog
            open={createSaleDialogOpen}
            onOpenChange={setCreateSaleDialogOpen}
            editingSale={editingSale}
            onEditComplete={() => setEditingSale(null)}
          />

          <ChatSalesConfigDialog
            open={configDialogOpen}
            onOpenChange={setConfigDialogOpen}
            editingConfig={editingConfig}
            onEditComplete={() => setEditingConfig(null)}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 