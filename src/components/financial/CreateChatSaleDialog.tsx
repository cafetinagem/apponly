import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calculator, DollarSign, User, Users } from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { ChatSale, ChatSalesConfig } from '@/types/financial';

interface CreateChatSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSale?: ChatSale | null;
  onEditComplete?: () => void;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  service_id: string;
  model_id: string;
  total_amount: number;
  description: string;
  sale_date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export function CreateChatSaleDialog({ 
  open, 
  onOpenChange, 
  editingSale,
  onEditComplete 
}: CreateChatSaleDialogProps) {
  const { models, chatSalesConfigs, createChatSale, updateChatSale, loading } = useFinancialData();
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    customer_email: '',
    service_id: '',
    model_id: '',
    total_amount: 0,
    description: '',
    sale_date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });
  const [selectedConfig, setSelectedConfig] = useState<ChatSalesConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or when editing changes
  useEffect(() => {
    if (open) {
      if (editingSale) {
        const config = chatSalesConfigs.find(c => c.id === editingSale.service_id);
        setSelectedConfig(config || null);
        setFormData({
          customer_name: editingSale.customer_name || '',
          customer_email: editingSale.customer_email || '',
          service_id: editingSale.service_id || '',
          model_id: editingSale.model_id || '',
          total_amount: editingSale.total_amount,
          description: editingSale.description || '',
          sale_date: editingSale.sale_date?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: editingSale.status
        });
      } else {
        setFormData({
          customer_name: '',
          customer_email: '',
          service_id: '',
          model_id: '',
          total_amount: 0,
          description: '',
          sale_date: new Date().toISOString().split('T')[0],
          status: 'pending'
        });
        setSelectedConfig(null);
      }
    }
  }, [open, editingSale, chatSalesConfigs]);

  // Update config and amount when service changes
  useEffect(() => {
    if (formData.service_id) {
      const config = chatSalesConfigs.find(c => c.id === formData.service_id);
      setSelectedConfig(config || null);
      if (config && !editingSale) {
        setFormData(prev => ({ ...prev, total_amount: config.base_price }));
      }
    } else {
      setSelectedConfig(null);
    }
  }, [formData.service_id, chatSalesConfigs, editingSale]);

  // Calculate split amounts
  const calculateAmounts = () => {
    if (!selectedConfig || !formData.total_amount) {
      return { adminAmount: 0, modelAmount: 0 };
    }

    const adminAmount = (formData.total_amount * selectedConfig.admin_percentage) / 100;
    const modelAmount = (formData.total_amount * selectedConfig.model_percentage) / 100;

    return { adminAmount, modelAmount };
  };

  const { adminAmount, modelAmount } = calculateAmounts();
  const selectedModel = models.find(m => m.id === formData.model_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConfig || !formData.model_id) return;

    setIsSubmitting(true);
    try {
      const saleData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || null,
        service_id: formData.service_id,
        service_name: selectedConfig.service_name,
        model_id: formData.model_id,
        total_amount: formData.total_amount,
        admin_amount: adminAmount,
        model_amount: modelAmount,
        admin_percentage: selectedConfig.admin_percentage,
        model_percentage: selectedConfig.model_percentage,
        description: formData.description || null,
        sale_date: formData.sale_date,
        status: formData.status
      };

      if (editingSale) {
        await updateChatSale(editingSale.id, saleData);
        onEditComplete?.();
      } else {
        await createChatSale(saleData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeConfigs = chatSalesConfigs.filter(config => config.is_active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            {editingSale ? 'Editar Venda de Chat' : 'Nova Venda de Chat'}
          </DialogTitle>
          <DialogDescription>
            {editingSale 
              ? 'Edite os dados da venda de chat personalizada'
              : 'Registre uma nova venda de chat personalizada'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações do Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nome do Cliente *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">Email do Cliente</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Configuração do Serviço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Configuração do Serviço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_id">Serviço *</Label>
                <Select value={formData.service_id} onValueChange={(value) => setFormData(prev => ({ ...prev, service_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{config.service_name}</span>
                          <Badge variant="outline" className="ml-2">
                            {formatCurrency(config.base_price)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_id">Modelo *</Label>
                <Select value={formData.model_id} onValueChange={(value) => setFormData(prev => ({ ...prev, model_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_amount">Valor Total *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.total_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_amount: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_date">Data da Venda *</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, sale_date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhes adicionais sobre a venda..."
                rows={3}
              />
            </div>
          </div>

          {/* Preview da Divisão */}
          {selectedConfig && formData.total_amount > 0 && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-orange-500" />
                  Preview da Divisão Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Total</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(formData.total_amount)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                      <User className="h-3 w-3" />
                      Seus Ganhos ({selectedConfig.admin_percentage}%)
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(adminAmount)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      {selectedModel?.name || 'Modelo'} ({selectedConfig.model_percentage}%)
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(modelAmount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedConfig || !formData.model_id || !formData.customer_name}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {editingSale ? 'Atualizando...' : 'Salvando...'}
              </div>
            ) : (
              editingSale ? 'Atualizar Venda' : 'Criar Venda'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 