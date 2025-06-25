import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { useModels } from '@/hooks/useModels';
import { CreateSaleForm } from '@/types/financial';
import { formatCurrency } from '@/lib/utils';

interface CreateSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSaleDialog({ open, onOpenChange }: CreateSaleDialogProps) {
  const { createSale, loading, calculateFinancialSplit } = useFinancialData();
  const { models } = useModels();
  
  const [formData, setFormData] = useState<CreateSaleForm>({
    model_id: '',
    platform: '',
    sale_type: 'privacy',
    gross_amount: 0,
    sale_date: new Date().toISOString().split('T')[0],
    description: '',
    client_email: '',
    transaction_id: ''
  });

  const [preview, setPreview] = useState<{
    platform_fee: number;
    admin_amount: number;
    model_amount: number;
    net_amount: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular preview quando modelo, plataforma ou valor mudarem
  useEffect(() => {
    const calculatePreview = async () => {
      if (formData.model_id && formData.platform && formData.gross_amount > 0) {
        const split = await calculateFinancialSplit(
          formData.model_id,
          formData.platform,
          formData.gross_amount
        );
        setPreview(split);
      } else {
        setPreview(null);
      }
    };

    calculatePreview();
  }, [formData.model_id, formData.platform, formData.gross_amount, calculateFinancialSplit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model_id || !formData.platform || formData.gross_amount <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createSale(formData);
      if (result) {
        // Reset form
        setFormData({
          model_id: '',
          platform: '',
          sale_type: 'privacy',
          gross_amount: 0,
          sale_date: new Date().toISOString().split('T')[0],
          description: '',
          client_email: '',
          transaction_id: ''
        });
        setPreview(null);
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const platforms = [
    { value: 'privacy', label: 'Privacy' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'onlyfans', label: 'OnlyFans' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const saleTypes = [
    { value: 'privacy', label: 'Privacy' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'chat', label: 'Chat' },
    { value: 'custom', label: 'Personalizado' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-500" />
            Nova Venda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="model_id">Modelo *</Label>
              <Select
                value={formData.model_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, model_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.artistic_name || model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plataforma */}
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Venda */}
            <div className="space-y-2">
              <Label htmlFor="sale_type">Tipo de Venda</Label>
              <Select
                value={formData.sale_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sale_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {saleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Valor Bruto */}
            <div className="space-y-2">
              <Label htmlFor="gross_amount">Valor Bruto (R$) *</Label>
              <Input
                id="gross_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.gross_amount || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  gross_amount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Data da Venda */}
            <div className="space-y-2">
              <Label htmlFor="sale_date">Data da Venda *</Label>
              <Input
                id="sale_date"
                type="date"
                value={formData.sale_date}
                onChange={(e) => setFormData(prev => ({ ...prev, sale_date: e.target.value }))}
              />
            </div>

            {/* Email do Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client_email">Email do Cliente</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                placeholder="cliente@exemplo.com"
              />
            </div>
          </div>

          {/* ID da Transação */}
          <div className="space-y-2">
            <Label htmlFor="transaction_id">ID da Transação</Label>
            <Input
              id="transaction_id"
              value={formData.transaction_id}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_id: e.target.value }))}
              placeholder="ID da transação da plataforma"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição adicional da venda..."
              rows={3}
            />
          </div>

          {/* Preview da Divisão */}
          {preview && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Preview da Divisão Financeira
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Taxa da Plataforma:</span>
                  <div className="font-bold text-red-600">
                    {formatCurrency(preview.platform_fee)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Valor Líquido:</span>
                  <div className="font-bold text-green-600">
                    {formatCurrency(preview.net_amount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Seu Ganho:</span>
                  <div className="font-bold text-blue-600">
                    {formatCurrency(preview.admin_amount)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Ganho da Modelo:</span>
                  <div className="font-bold text-purple-600">
                    {formatCurrency(preview.model_amount)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!formData.model_id || !formData.platform || formData.gross_amount <= 0 || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Venda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 