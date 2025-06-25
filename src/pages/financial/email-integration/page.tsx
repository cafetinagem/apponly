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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Plus, 
  Settings, 
  Play, 
  Pause,
  Trash2,
  Edit,
  RotateCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Download
} from 'lucide-react';
import { useEmailIntegration } from '@/hooks/financial/useEmailIntegration';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EmailConfigForm {
  name: string;
  email_provider: string;
  email_address: string;
  imap_server: string;
  imap_port: number;
  use_ssl: boolean;
  username: string;
  password: string;
  keywords: string[];
  sync_frequency: number;
  is_active: boolean;
}

export default function EmailIntegrationPage() {
  const { 
    integrations: emailIntegrations, 
    emailLogs, 
    syncing: isProcessing, 
    createIntegration: createEmailIntegration,
    syncEmails,
    syncAllIntegrations: processEmailSales,
    loading 
  } = useEmailIntegration();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmailConfigForm>({
    name: '',
    email_provider: 'gmail',
    email_address: '',
    imap_server: 'imap.gmail.com',
    imap_port: 993,
    use_ssl: true,
    username: '',
    password: '',
    keywords: ['privacy', 'venda', 'pagamento'],
    sync_frequency: 30,
    is_active: true
  });

  const providers = [
    {
      value: 'gmail',
      label: 'Gmail',
      imap_server: 'imap.gmail.com',
      imap_port: 993,
      use_ssl: true
    },
    {
      value: 'outlook',
      label: 'Outlook/Hotmail',
      imap_server: 'outlook.office365.com',
      imap_port: 993,
      use_ssl: true
    },
    {
      value: 'yahoo',
      label: 'Yahoo',
      imap_server: 'imap.mail.yahoo.com',
      imap_port: 993,
      use_ssl: true
    },
    {
      value: 'custom',
      label: 'Servidor Personalizado',
      imap_server: '',
      imap_port: 993,
      use_ssl: true
    }
  ];

  const handleProviderChange = (provider: string) => {
    const selectedProvider = providers.find(p => p.value === provider);
    if (selectedProvider) {
      setFormData(prev => ({
        ...prev,
        email_provider: provider,
        imap_server: selectedProvider.imap_server,
        imap_port: selectedProvider.imap_port,
        use_ssl: selectedProvider.use_ssl
      }));
    }
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    setFormData(prev => ({ ...prev, keywords }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmailIntegration(formData);
      setIsConfiguring(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar integração:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email_provider: 'gmail',
      email_address: '',
      imap_server: 'imap.gmail.com',
      imap_port: 993,
      use_ssl: true,
      username: '',
      password: '',
      keywords: ['privacy', 'venda', 'pagamento'],
      sync_frequency: 30,
      is_active: true
    });
    setEditingId(null);
  };

  const handleSync = async (integrationId: string) => {
    try {
      await syncEmails(integrationId);
    } catch (error) {
      console.error('Erro ao sincronizar emails:', error);
    }
  };

  const handleProcessSales = async () => {
    try {
      await processEmailSales();
    } catch (error) {
      console.error('Erro ao processar vendas:', error);
    }
  };

  // Estatísticas dos logs
  const logStats = {
    total: emailLogs.length,
    processed: emailLogs.filter(log => log.processing_status === 'processed').length,
    pending: emailLogs.filter(log => log.processing_status === 'pending').length,
    errors: emailLogs.filter(log => log.processing_status === 'error').length,
    ignored: emailLogs.filter(log => log.processing_status === 'ignored').length
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Mail className="h-8 w-8 text-indigo-500" />
                Integração de Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure integrações para processar emails de vendas automaticamente
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleProcessSales}
                variant="outline"
                className="gap-2"
                disabled={isProcessing}
              >
                <RotateCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                Processar Vendas
              </Button>
              <Button 
                onClick={() => setIsConfiguring(true)}
                className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                disabled={isConfiguring}
              >
                <Plus className="h-4 w-4" />
                Nova Integração
              </Button>
            </div>
          </div>

          {/* Informações Importantes */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <strong>Como funciona:</strong> O sistema monitora sua caixa de entrada em busca de emails de vendas.
              <br />
              <strong>Segurança:</strong> Suas credenciais são criptografadas e usamos OAuth2 quando disponível.
              <br />
              <strong>Suporte:</strong> Gmail, Outlook, Yahoo e servidores IMAP personalizados.
            </AlertDescription>
          </Alert>

          {/* Estatísticas de Processamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-indigo-100 text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Total de Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {logStats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Processados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {logStats.processed}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {logStats.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Erros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {logStats.errors}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-gray-300 text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  Ignorados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {logStats.ignored}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Configuração */}
          {isConfiguring && (
            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-500" />
                  {editingId ? 'Editar Integração' : 'Nova Integração de Email'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Integração *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Email Privacy Principal"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email_provider">Provedor *</Label>
                      <Select value={formData.email_provider} onValueChange={handleProviderChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider.value} value={provider.value}>
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Configurações de Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email_address">Endereço de Email *</Label>
                      <Input
                        id="email_address"
                        type="email"
                        value={formData.email_address}
                        onChange={(e) => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
                        placeholder="seuemail@exemplo.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Usuário</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Geralmente o mesmo email"
                      />
                    </div>
                  </div>

                  {/* Configurações IMAP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imap_server">Servidor IMAP *</Label>
                      <Input
                        id="imap_server"
                        value={formData.imap_server}
                        onChange={(e) => setFormData(prev => ({ ...prev, imap_server: e.target.value }))}
                        placeholder="imap.gmail.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imap_port">Porta IMAP *</Label>
                      <Input
                        id="imap_port"
                        type="number"
                        value={formData.imap_port}
                        onChange={(e) => setFormData(prev => ({ ...prev, imap_port: parseInt(e.target.value) || 993 }))}
                        placeholder="993"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sync_frequency">Frequência (min) *</Label>
                      <Input
                        id="sync_frequency"
                        type="number"
                        min="5"
                        max="1440"
                        value={formData.sync_frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, sync_frequency: parseInt(e.target.value) || 30 }))}
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha ou Senha de App *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Para Gmail use Senha de App"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Para Gmail: Gere uma senha de app em Configurações → Segurança
                    </p>
                  </div>

                  {/* Palavras-chave */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave (separadas por vírgula) *</Label>
                    <Textarea
                      id="keywords"
                      value={formData.keywords.join(', ')}
                      onChange={(e) => handleKeywordsChange(e.target.value)}
                      placeholder="privacy, venda, pagamento, recebido"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500">
                      Emails contendo essas palavras serão processados para extrair vendas
                    </p>
                  </div>

                  {/* Configurações Avançadas */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use_ssl"
                        checked={formData.use_ssl}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_ssl: checked }))}
                      />
                      <Label htmlFor="use_ssl">Usar SSL/TLS</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active">Integração Ativa</Label>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsConfiguring(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.name || !formData.email_address || !formData.imap_server}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      {editingId ? 'Atualizar Integração' : 'Criar Integração'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Integrações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-500" />
                Integrações Configuradas ({emailIntegrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Carregando integrações...</p>
                </div>
              ) : emailIntegrations.length > 0 ? (
                <div className="space-y-4">
                  {emailIntegrations.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-4 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {integration.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {integration.email_address} • {integration.email_provider}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.is_active ? 'default' : 'secondary'}>
                            {integration.is_active ? 'Ativa' : 'Inativa'}
                          </Badge>
                          {integration.is_active && (
                            <Button
                              onClick={() => handleSync(integration.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={isProcessing}
                            >
                              <RotateCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                            </Button>
                          )}
                          <Button
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400 mb-1">Última Sincronização</div>
                          <div className="font-medium">
                            {integration.last_sync ? 
                              formatDistanceToNow(new Date(integration.last_sync), { 
                                addSuffix: true, 
                                locale: ptBR 
                              }) : 'Nunca'
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400 mb-1">Frequência</div>
                          <div className="font-medium">{integration.sync_frequency} min</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400 mb-1">Palavras-chave</div>
                          <div className="font-medium">{integration.keywords.length} configuradas</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400 mb-1">SSL/TLS</div>
                          <div className="font-medium">
                            {integration.use_ssl ? 'Habilitado' : 'Desabilitado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhuma integração configurada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Configure sua primeira integração para processar emails automaticamente
                  </p>
                  <Button 
                    onClick={() => setIsConfiguring(true)}
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Configurar Primeira Integração
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logs de Processamento */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Logs de Processamento (últimos 50)
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {emailLogs.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {emailLogs.slice(0, 50).map((log) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'processed': return 'bg-green-100 text-green-800 border-green-200';
                        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'error': return 'bg-red-100 text-red-800 border-red-200';
                        case 'ignored': return 'bg-gray-100 text-gray-800 border-gray-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                      }
                    };

                    const getStatusText = (status: string) => {
                      switch (status) {
                        case 'processed': return 'Processado';
                        case 'pending': return 'Pendente';
                        case 'error': return 'Erro';
                        case 'ignored': return 'Ignorado';
                        default: return status;
                      }
                    };

                    return (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {log.email_subject || 'Sem assunto'}
                            </span>
                            <Badge className={getStatusColor(log.processing_status)}>
                              {getStatusText(log.processing_status)}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            De: {log.email_from} • {new Date(log.created_at).toLocaleString('pt-BR')}
                          </div>
                          {log.extracted_amount && (
                            <div className="text-xs text-green-600 mt-1">
                              Valor extraído: {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(log.extracted_amount)}
                            </div>
                          )}
                          {log.error_message && (
                            <div className="text-xs text-red-600 mt-1">
                              Erro: {log.error_message}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhum log de processamento disponível
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 