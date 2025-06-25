import React, { useState } from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, AlertTriangle, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AdminSecuritySettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    ipWhitelist: '',
    apiKeyRotation: 30,
    auditLogging: true,
    bruteForceProtection: true,
    emailOnSuspiciousActivity: true
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ Configurações Salvas",
        description: "As configurações de segurança foram atualizadas com sucesso.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewApiKey = () => {
    toast({
      title: "🔑 Nova Chave API",
      description: "Uma nova chave API foi gerada. A chave anterior foi invalidada.",
      variant: "default"
    });
  };

  const updateSetting = (key: keyof typeof securitySettings, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AdminRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/settings">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  Configurações de Segurança
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Configure parâmetros de segurança e acesso
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </div>

          {/* Security Alert */}
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Configurações Críticas
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Alterações nas configurações de segurança afetam todos os usuários do sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Autenticação</CardTitle>
                    <CardDescription>Configurações de login e acesso</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Autenticação Dois Fatores</Label>
                    <p className="text-xs text-gray-500">Exigir 2FA para todos os usuários</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Timeout de Sessão (minutos)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Máximo de Tentativas de Login</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Proteção Força Bruta</Label>
                    <p className="text-xs text-gray-500">Bloquear IPs após tentativas falhadas</p>
                  </div>
                  <Switch
                    checked={securitySettings.bruteForceProtection}
                    onCheckedChange={(checked) => updateSetting('bruteForceProtection', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Password Policy */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Política de Senhas</CardTitle>
                    <CardDescription>Requisitos de complexidade</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comprimento Mínimo</Label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Caracteres Especiais</Label>
                    <p className="text-xs text-gray-500">Exigir símbolos nas senhas</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) => updateSetting('requireSpecialChars', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rotação da Chave API (dias)</Label>
                  <Input
                    type="number"
                    value={securitySettings.apiKeyRotation}
                    onChange={(e) => updateSetting('apiKeyRotation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lista Branca de IPs</Label>
                  <Input
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => updateSetting('ipWhitelist', e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">IPs separados por vírgula</p>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring & Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Monitoramento</CardTitle>
                    <CardDescription>Logs e alertas de segurança</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Log de Auditoria</Label>
                    <p className="text-xs text-gray-500">Registrar todas as ações críticas</p>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => updateSetting('auditLogging', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Alertas por Email</Label>
                    <p className="text-xs text-gray-500">Notificar atividades suspeitas</p>
                  </div>
                  <Switch
                    checked={securitySettings.emailOnSuspiciousActivity}
                    onCheckedChange={(checked) => updateSetting('emailOnSuspiciousActivity', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* API Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Segurança da API</CardTitle>
                    <CardDescription>Chaves e autenticação da API</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chave API Atual</Label>
                  <div className="flex space-x-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGenerateNewApiKey}
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Gerar Nova Chave API
                </Button>

                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    ⚠️ Gerar uma nova chave invalidará a chave atual imediatamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AdminRoute>
  );
} 