import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Percent,
  DollarSign,
  Users,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency } from '@/lib/utils';
import { FinancialSettings } from '@/types/financial';

interface SettingsFormData {
  model_id: string;
  platform_name: string;
  platform_percentage: number;
  admin_percentage: number;
  model_percentage: number;
  is_active: boolean;
}

export default function FinancialSettingsPage() {
  const { models, financialSettings, loading } = useFinancialData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SettingsFormData>({
    model_id: '',
    platform_name: '',
    platform_percentage: 20,
    admin_percentage: 50,
    model_percentage: 30,
    is_active: true
  });

  const platforms = [
    { value: 'privacy', label: 'Privacy', defaultFee: 20 },
    { value: 'telegram', label: 'Telegram', defaultFee: 0 },
    { value: 'instagram', label: 'Instagram', defaultFee: 0 },
    { value: 'whatsapp', label: 'WhatsApp', defaultFee: 0 },
    { value: 'onlyfans', label: 'OnlyFans', defaultFee: 20 },
    { value: 'custom', label: 'Personalizada', defaultFee: 0 }
  ];

  const handlePlatformChange = (platform: string) => {
    const selectedPlatform = platforms.find(p => p.value === platform);
    if (selectedPlatform) {
      const platformFee = selectedPlatform.defaultFee;
      const remaining = 100 - platformFee;
      const adminPercentage = Math.round(remaining * 0.6); // 60% do restante
      const modelPercentage = remaining - adminPercentage;
      
      setFormData(prev => ({
        ...prev,
        platform_name: platform,
        platform_percentage: platformFee,
        admin_percentage: adminPercentage,
        model_percentage: modelPercentage
      }));
    }
  };

  const handlePercentageChange = (field: 'admin_percentage' | 'model_percentage', value: number) => {
    const platformPercentage = formData.platform_percentage;
    const available = 100 - platformPercentage;
    
    if (field === 'admin_percentage') {
      const newAdminPercentage = Math.min(available, Math.max(0, value));
      const newModelPercentage = available - newAdminPercentage;
      
      setFormData(prev => ({
        ...prev,
        admin_percentage: newAdminPercentage,
        model_percentage: newModelPercentage
      }));
    } else {
      const newModelPercentage = Math.min(available, Math.max(0, value));
      const newAdminPercentage = available - newModelPercentage;
      
      setFormData(prev => ({
        ...prev,
        admin_percentage: newAdminPercentage,
        model_percentage: newModelPercentage
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar criação/edição
    console.log('Salvando configuração:', formData);
    setIsEditing(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      model_id: '',
      platform_name: '',
      platform_percentage: 20,
      admin_percentage: 50,
      model_percentage: 30,
      is_active: true
    });
  };

  const handleEdit = (setting: FinancialSettings) => {
    setFormData({
      model_id: setting.model_id,
      platform_name: setting.platform_name,
      platform_percentage: setting.platform_percentage,
      admin_percentage: setting.admin_percentage,
      model_percentage: setting.model_percentage,
      is_active: setting.is_active
    });
    setEditingId(setting.id);
    setIsEditing(true);
  };

  const totalPercentage = formData.platform_percentage + formData.admin_percentage + formData.model_percentage;
  const isValidPercentage = totalPercentage === 100;

  // Preview calculation
  const previewAmount = 1000;
  const platformFee = (previewAmount * formData.platform_percentage) / 100;
  const adminAmount = (previewAmount * formData.admin_percentage) / 100;
  const modelAmount = (previewAmount * formData.model_percentage) / 100;

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Settings className="h-8 w-8 text-purple-500" />
                Configurações Financeiras
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure percentuais personalizados por modelo e plataforma
              </p>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              className="gap-2 bg-purple-500 hover:bg-purple-600"
              disabled={isEditing}
            >
              <Plus className="h-4 w-4" />
              Nova Configuração
            </Button>
          </div>

          {/* Informação sobre Configurações Padrão */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <strong>Configuração Padrão:</strong> Privacy 20% de taxa + divisão 50/30 (Admin/Modelo) = 100%
              <br />
              <strong>Personalize:</strong> Crie configurações específicas para cada modelo e plataforma
            </AlertDescription>
          </Alert>

          {/* Formulário de Configuração */}
          {isEditing && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-purple-500" />
                  {editingId ? 'Editar Configuração' : 'Nova Configuração'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Seleção de Modelo e Plataforma */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="platform_name">Plataforma *</Label>
                      <Select value={formData.platform_name} onValueChange={handlePlatformChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{platform.label}</span>
                                {platform.defaultFee > 0 && (
                                  <Badge variant="outline" className="ml-2">
                                    {platform.defaultFee}% taxa
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Configuração de Percentuais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Divisão de Percentuais
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform_percentage">Taxa da Plataforma (%)</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="platform_percentage"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.platform_percentage}
                            onChange={(e) => setFormData(prev => ({ ...prev, platform_percentage: parseInt(e.target.value) || 0 }))}
                            className="pl-10"
                            disabled={formData.platform_name === 'privacy'}
                          />
                        </div>
                        {formData.platform_name === 'privacy' && (
                          <p className="text-xs text-gray-500">Taxa fixa da Privacy</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin_percentage">Seu Percentual (%)</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="admin_percentage"
                            type="number"
                            min="0"
                            max={100 - formData.platform_percentage}
                            value={formData.admin_percentage}
                            onChange={(e) => handlePercentageChange('admin_percentage', parseInt(e.target.value) || 0)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model_percentage">Percentual da Modelo (%)</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="model_percentage"
                            type="number"
                            min="0"
                            max={100 - formData.platform_percentage}
                            value={formData.model_percentage}
                            onChange={(e) => handlePercentageChange('model_percentage', parseInt(e.target.value) || 0)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Validação dos Percentuais */}
                    {!isValidPercentage && (
                      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700 dark:text-red-300">
                          Os percentuais devem somar exatamente 100%. Atualmente: {totalPercentage}%
                        </AlertDescription>
                      </Alert>
                    )}

                    {isValidPercentage && (
                      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          Configuração válida! Os percentuais somam 100%.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Preview da Configuração */}
                  <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        Preview da Configuração
                        <Badge variant="outline" className="ml-auto">
                          Exemplo com {formatCurrency(previewAmount)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Taxa da Plataforma ({formData.platform_percentage}%)
                          </div>
                          <div className="text-lg font-bold text-red-600">
                            {formatCurrency(platformFee)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Seus Ganhos ({formData.admin_percentage}%)
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(adminAmount)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Modelo ({formData.model_percentage}%)
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            {formatCurrency(modelAmount)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status da Configuração */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active" className="flex items-center gap-2">
                      <span>Configuração Ativa</span>
                      <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                        {formData.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </Label>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isValidPercentage || !formData.model_id || !formData.platform_name}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {editingId ? 'Atualizar Configuração' : 'Criar Configuração'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Configurações Existentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                Configurações Existentes ({financialSettings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Carregando configurações...</p>
                </div>
              ) : financialSettings.length > 0 ? (
                <div className="space-y-4">
                  {financialSettings.map((setting) => {
                    const model = models.find(m => m.id === setting.model_id);
                    const platform = platforms.find(p => p.value === setting.platform_name);
                    
                    return (
                      <div key={setting.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {model?.name || 'Modelo não encontrada'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {platform?.label || setting.platform_name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={setting.is_active ? 'default' : 'secondary'}>
                              {setting.is_active ? 'Ativa' : 'Inativa'}
                            </Badge>
                            <Button
                              onClick={() => handleEdit(setting)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Plataforma</div>
                            <div className="font-semibold text-red-600">{setting.platform_percentage}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Admin</div>
                            <div className="font-semibold text-green-600">{setting.admin_percentage}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600 dark:text-gray-400 mb-1">Modelo</div>
                            <div className="font-semibold text-purple-600">{setting.model_percentage}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhuma configuração personalizada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    O sistema usará a configuração padrão para todas as vendas
                  </p>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Configuração
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 