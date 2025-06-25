
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Shield, Mail, Database } from 'lucide-react';
import { useSystemSettings } from '@/hooks/admin/useSystemSettings';

export function SystemSettingsForm() {
  const { settings, loading, loadSettings, saveSettings, updateSetting } = useSystemSettings();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = () => {
    saveSettings(settings);
  };

  const settingsSections = useMemo(() => [
    {
      title: "Configurações Gerais",
      description: "Configurações básicas do sistema",
      icon: Settings,
      settings: [
        {
          key: 'maintenanceMode' as const,
          label: "Modo Manutenção",
          description: "Ativar modo de manutenção",
          type: "switch"
        },
        {
          key: 'allowRegistrations' as const,
          label: "Permitir Registros",
          description: "Permitir novos registros de usuários",
          type: "switch"
        },
        {
          key: 'systemName' as const,
          label: "Nome do Sistema",
          description: "Nome exibido no sistema",
          type: "input"
        },
        {
          key: 'timezone' as const,
          label: "Fuso Horário",
          description: "Fuso horário padrão do sistema",
          type: "input"
        }
      ]
    },
    {
      title: "Segurança",
      description: "Configurações de segurança e acesso",
      icon: Shield,
      settings: [
        {
          key: 'twoFactorRequired' as const,
          label: "2FA Obrigatório",
          description: "Exigir autenticação em dois fatores",
          type: "switch"
        },
        {
          key: 'sessionTimeout' as const,
          label: "Timeout de Sessão",
          description: "Tempo limite de sessão (minutos)",
          type: "number"
        },
        {
          key: 'maxLoginAttempts' as const,
          label: "Tentativas de Login",
          description: "Máximo de tentativas de login",
          type: "number"
        }
      ]
    },
    {
      title: "Notificações",
      description: "Configurações de email e notificações",
      icon: Mail,
      settings: [
        {
          key: 'emailOnApproval' as const,
          label: "Email na Aprovação",
          description: "Enviar email ao aprovar usuário",
          type: "switch"
        },
        {
          key: 'emailOnRejection' as const,
          label: "Email na Rejeição",
          description: "Enviar email ao rejeitar usuário",
          type: "switch"
        },
        {
          key: 'emailAdminNotification' as const,
          label: "Notificar Admin",
          description: "Notificar admin sobre novos usuários",
          type: "switch"
        },
        {
          key: 'smtpServer' as const,
          label: "Servidor SMTP",
          description: "Servidor SMTP para envio de emails",
          type: "input"
        }
      ]
    },
    {
      title: "Banco de Dados",
      description: "Configurações do banco de dados",
      icon: Database,
      settings: [
        {
          key: 'autoBackup' as const,
          label: "Backup Automático",
          description: "Ativar backup automático",
          type: "switch"
        },
        {
          key: 'backupInterval' as const,
          label: "Intervalo de Backup",
          description: "Intervalo de backup (horas)",
          type: "number"
        },
        {
          key: 'logRetentionDays' as const,
          label: "Retenção de Logs",
          description: "Dias para manter logs",
          type: "number"
        },
        {
          key: 'autoCleanup' as const,
          label: "Limpeza Automática",
          description: "Limpeza automática de dados antigos",
          type: "switch"
        }
      ]
    }
  ], []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure os parâmetros do sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/settings/security">
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Configurações de Segurança
            </Button>
          </Link>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <section.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">{setting.label}</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                  </div>
                  <div className="ml-4">
                    {setting.type === 'switch' && (
                      <Switch
                        checked={settings[setting.key] as boolean}
                        onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                      />
                    )}
                    {setting.type === 'input' && (
                      <Input
                        className="w-40"
                        value={settings[setting.key] as string}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                      />
                    )}
                    {setting.type === 'number' && (
                      <Input
                        type="number"
                        className="w-32"
                        value={settings[setting.key] as number}
                        onChange={(e) => updateSetting(setting.key, parseInt(e.target.value) || 0)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
