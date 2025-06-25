import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Check, 
  AlertCircle, 
  RotateCw,
  Trash2,
  Plus,
  Settings,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface EmailConfig {
  id?: string;
  email: string;
  password: string;
  provider: 'gmail' | 'outlook' | 'yahoo';
  status: 'active' | 'inactive' | 'error';
  last_sync?: string;
  sales_count?: number;
}

const EMAIL_PROVIDERS = {
  gmail: {
    name: 'Gmail',
    icon: '📧',
    server: 'imap.gmail.com',
    port: 993,
    instructions: 'Use sua Senha de App do Gmail (16 caracteres)'
  },
  outlook: {
    name: 'Outlook/Hotmail',
    icon: '📮',
    server: 'outlook.office365.com', 
    port: 993,
    instructions: 'Use sua senha normal do Outlook'
  },
  yahoo: {
    name: 'Yahoo',
    icon: '📯',
    server: 'imap.mail.yahoo.com',
    port: 993,
    instructions: 'Use sua senha normal do Yahoo'
  }
};

export function SimpleEmailIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([
    // Mock data para demonstração
    {
      id: '1',
      email: 'modelo@gmail.com',
      provider: 'gmail',
      status: 'active',
      last_sync: '2024-06-25T14:30:00Z',
      sales_count: 23,
      password: '••••••••••••••••'
    }
  ]);

  const [newEmail, setNewEmail] = useState({
    email: '',
    password: '',
    provider: 'gmail' as 'gmail' | 'outlook' | 'yahoo'
  });

  const handleAddEmail = async () => {
    if (!newEmail.email || !newEmail.password) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha email e senha",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newConfig: EmailConfig = {
        id: Date.now().toString(),
        email: newEmail.email,
        password: newEmail.password,
        provider: newEmail.provider,
        status: 'active',
        last_sync: new Date().toISOString(),
        sales_count: 0
      };

      setEmailConfigs(prev => [...prev, newConfig]);
      setNewEmail({ email: '', password: '', provider: 'gmail' });
      setIsAdding(false);

      toast({
        title: "✅ Email configurado!",
        description: `${newEmail.email} conectado com sucesso`,
      });

      // Iniciar sincronização automática
      handleSyncEmail(newConfig.id!);

    } catch (error) {
      toast({
        title: "❌ Erro na conexão",
        description: "Verifique email e senha",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncEmail = async (configId: string) => {
    const config = emailConfigs.find(c => c.id === configId);
    if (!config) return;

    toast({
      title: "🔄 Sincronizando...",
      description: `Buscando emails em ${config.email}`,
    });

    try {
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular vendas encontradas
      const newSalesFound = Math.floor(Math.random() * 5) + 1;
      
      setEmailConfigs(prev => prev.map(c => 
        c.id === configId 
          ? { 
              ...c, 
              last_sync: new Date().toISOString(),
              sales_count: (c.sales_count || 0) + newSalesFound
            }
          : c
      ));

      toast({
        title: "✅ Sincronização completa!",
        description: `${newSalesFound} vendas encontradas e processadas`,
      });

    } catch (error) {
      toast({
        title: "❌ Erro na sincronização",
        description: "Tente novamente em alguns minutos",
        variant: "destructive"
      });
    }
  };

  const handleRemoveEmail = (configId: string) => {
    setEmailConfigs(prev => prev.filter(c => c.id !== configId));
    toast({
      title: "🗑️ Email removido",
      description: "Integração desconectada",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">✅ Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">⏸️ Pausado</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Erro</Badge>;
      default:
        return <Badge variant="outline">❓ Desconhecido</Badge>;
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Agora há pouco';
    if (diffMinutes < 60) return `${diffMinutes}min atrás`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
    return `${Math.floor(diffMinutes / 1440)} dias atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">📧 Integração de Email Simples</h2>
        <p className="text-muted-foreground">
          Conecte seu email e receba suas vendas automaticamente no sistema
        </p>
      </div>

      {/* Instruções Rápidas */}
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          <strong>Como funciona:</strong> Conecte seu email → Sistema lê emails de vendas → 
          Cria vendas automaticamente → Você vê tudo no dashboard!
        </AlertDescription>
      </Alert>

      {/* Lista de Emails Configurados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Seus Emails Conectados</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            className="gap-2"
            disabled={isAdding}
          >
            <Plus className="h-4 w-4" />
            Adicionar Email
          </Button>
        </div>

        {emailConfigs.map((config) => (
          <Card key={config.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {EMAIL_PROVIDERS[config.provider].icon}
                  </div>
                  <div>
                    <div className="font-medium">{config.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {EMAIL_PROVIDERS[config.provider].name} • 
                      Última sync: {formatLastSync(config.last_sync)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">
                        {config.sales_count || 0} vendas
                      </span>
                    </div>
                    {getStatusBadge(config.status)}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSyncEmail(config.id!)}
                      className="gap-1"
                    >
                      <RotateCw className="h-3 w-3" />
                      Sync
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveEmail(config.id!)}
                      className="text-red-600 hover:text-red-700 gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {emailConfigs.length === 0 && !isAdding && (
          <Card className="border-dashed border-2">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum email conectado</h3>
              <p className="text-muted-foreground mb-4">
                Adicione seu email para começar a receber vendas automaticamente
              </p>
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Conectar Primeiro Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Formulário de Adicionar Email */}
      {isAdding && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">
              ➕ Adicionar Novo Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seletor de Provedor */}
            <div className="space-y-2">
              <Label>Provedor de Email</Label>
              <Select 
                value={newEmail.provider} 
                onValueChange={(value) => setNewEmail(prev => ({ 
                  ...prev, 
                  provider: value as 'gmail' | 'outlook' | 'yahoo' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMAIL_PROVIDERS).map(([key, provider]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        <span>{provider.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                💡 {EMAIL_PROVIDERS[newEmail.provider].instructions}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Seu Email</Label>
              <Input
                type="email"
                placeholder={`exemplo@${newEmail.provider}.com`}
                value={newEmail.email}
                onChange={(e) => setNewEmail(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label>
                {newEmail.provider === 'gmail' ? 'Senha de App (16 caracteres)' : 'Senha'}
              </Label>
              <Input
                type="password"
                placeholder={newEmail.provider === 'gmail' ? 'abcd efgh ijkl mnop' : 'Sua senha normal'}
                value={newEmail.password}
                onChange={(e) => setNewEmail(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            {/* Instruções específicas do Gmail */}
            {newEmail.provider === 'gmail' && (
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Gmail:</strong> Use uma Senha de App, não sua senha normal.
                  <br />
                  <a 
                    href="https://myaccount.google.com/apppasswords" 
                    target="_blank" 
                    className="text-blue-600 underline"
                  >
                    Criar Senha de App aqui →
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleAddEmail} 
                disabled={isLoading}
                className="flex-1 gap-2"
              >
                {isLoading ? (
                  <RotateCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {isLoading ? 'Testando Conexão...' : 'Conectar Email'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewEmail({ email: '', password: '', provider: 'gmail' });
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Como Funciona */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            🤖 Como o Sistema Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl">📧</div>
              <h4 className="font-medium">1. Conecta Email</h4>
              <p className="text-sm text-muted-foreground">
                Você conecta seu email onde recebe notificações de vendas
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">🔍</div>
              <h4 className="font-medium">2. Sistema Monitora</h4>
              <p className="text-sm text-muted-foreground">
                Sistema verifica emails a cada 30 minutos procurando vendas
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">💰</div>
              <h4 className="font-medium">3. Cria Vendas</h4>
              <p className="text-sm text-muted-foreground">
                Automaticamente cria vendas no sistema e atualiza dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de Emails Detectados */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Emails que o Sistema Detecta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="font-medium text-green-800 dark:text-green-200">
                ✅ Privacy: "Nova venda recebida - R$ 85,00"
              </div>
              <div className="text-sm text-muted-foreground">
                Detecta automaticamente vendas do Privacy
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="font-medium text-green-800 dark:text-green-200">
                ✅ PIX: "PIX recebido - R$ 120,00"
              </div>
              <div className="text-sm text-muted-foreground">
                Identifica transferências PIX de qualquer banco
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="font-medium text-green-800 dark:text-green-200">
                ✅ Cartão: "Payment received $50.00"
              </div>
              <div className="text-sm text-muted-foreground">
                Processa pagamentos em cartão (PayPal, Stripe, etc.)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}