import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings2, Calculator, DollarSign, Percent, AlertTriangle } from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { ChatSalesConfig } from '@/types/financial';

interface ChatSalesConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingConfig?: ChatSalesConfig | null;
  onEditComplete?: () => void;
}

interface FormData {
  service_name: string;
  description: string;
  base_price: number;
  admin_percentage: number;
  model_percentage: number;
  is_active: boolean;
}

export function ChatSalesConfigDialog({ 
  open, 
  onOpenChange, 
  editingConfig,
  onEditComplete 
}: ChatSalesConfigDialogProps) {
  const { createChatSalesConfig, updateChatSalesConfig, loading } = useFinancialData();
  const [formData, setFormData] = useState<FormData>({
    service_name: '',
    description: '',
    base_price: 0,
    admin_percentage: 60,
    model_percentage: 40,
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or when editing changes
  useEffect(() => {
    if (open) {
      if (editingConfig) {
        setFormData({
          service_name: editingConfig.service_name,
          description: editingConfig.description || '',
          base_price: editingConfig.base_price,
          admin_percentage: editingConfig.admin_percentage,
          model_percentage: editingConfig.model_percentage,
          is_active: editingConfig.is_active
        });
      } else {
        setFormData({
          service_name: '',
          description: '',
          base_price: 0,
          admin_percentage: 60,
          model_percentage: 40,
          is_active: true
        });
      }
    }
  }, [open, editingConfig]);

  // Auto-adjust percentages to ensure they add up to 100%
  const handleAdminPercentageChange = (value: number) => {
    const newAdminPercentage = Math.min(100, Math.max(0, value));
    const newModelPercentage = 100 - newAdminPercentage;
    
    setFormData(prev => ({
      ...prev,
      admin_percentage: newAdminPercentage,
      model_percentage: newModelPercentage
    }));
  };

  const handleModelPercentageChange = (value: number) => {
    const newModelPercentage = Math.min(100, Math.max(0, value));
    const newAdminPercentage = 100 - newModelPercentage;
    
    setFormData(prev => ({
      ...prev,
      admin_percentage: newAdminPercentage,
      model_percentage: newModelPercentage
    }));
  };

  // Calculate preview amounts
  const previewAmount = 1000; // Valor exemplo para preview
  const adminAmount = (previewAmount * formData.admin_percentage) / 100;
  const modelAmount = (previewAmount * formData.model_percentage) / 100;
  const totalPercentage = formData.admin_percentage + formData.model_percentage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalPercentage !== 100) return;

    setIsSubmitting(true);
    try {
      const configData = {
        service_name: formData.service_name,
        description: formData.description || null,
        base_price: formData.base_price,
        admin_percentage: formData.admin_percentage,
        model_percentage: formData.model_percentage,
        is_active: formData.is_active
      };

      if (editingConfig) {
        await updateChatSalesConfig(editingConfig.id, configData);
        onEditComplete?.();
      } else {
        await createChatSalesConfig(configData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-orange-500" />
            {editingConfig ? 'Editar Configuração de Serviço' : 'Nova Configuração de Serviço'}
          </DialogTitle>
          <DialogDescription>
            {editingConfig 
              ? 'Edite as configurações do serviço de chat personalizado'
              : 'Configure um novo serviço de chat com percentuais personalizados'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_name">Nome do Serviço *</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                  placeholder="Ex: Chat Personalizado VIP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_price">Preço Base *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.base_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço oferecido..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active" className="flex items-center gap-2">
                <span>Serviço Ativo</span>
                <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                  {formData.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </Label>
            </div>
          </div>

          {/* Configuração de Percentuais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Divisão de Percentuais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin_percentage">Seu Percentual (%) *</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.admin_percentage}
                    onChange={(e) => handleAdminPercentageChange(parseInt(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_percentage">Percentual da Modelo (%) *</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="model_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.model_percentage}
                    onChange={(e) => handleModelPercentageChange(parseInt(e.target.value) || 0)}
                    className="pl-10"
                    placeholder="40"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Validação dos Percentuais */}
            {totalPercentage !== 100 && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  Os percentuais devem somar exatamente 100%. Atualmente: {totalPercentage}%
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Preview da Configuração */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-orange-500" />
                Preview da Configuração
                <Badge variant="outline" className="ml-auto">
                  Exemplo com {formatCurrency(previewAmount)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preço Base</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(formData.base_price)}
                  </div>
                  <div className="text-xs text-gray-500">Valor padrão</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Seus Ganhos ({formData.admin_percentage}%)
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(adminAmount)}
                  </div>
                  <div className="text-xs text-gray-500">Por venda de {formatCurrency(previewAmount)}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Modelo ({formData.model_percentage}%)
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(modelAmount)}
                  </div>
                  <div className="text-xs text-gray-500">Por venda de {formatCurrency(previewAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            disabled={isSubmitting || totalPercentage !== 100 || !formData.service_name}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {editingConfig ? 'Atualizando...' : 'Salvando...'}
              </div>
            ) : (
              editingConfig ? 'Atualizar Configuração' : 'Criar Configuração'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 