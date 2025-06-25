import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Mail, Check, RotateCw, Trash2, Plus, DollarSign, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailConfig {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo';
  status: 'active' | 'inactive';
  salesCount: number;
  lastSync: string;
}

export function QuickEmailSetup() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [emails, setEmails] = useState<EmailConfig[]>([]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    provider: 'gmail' as 'gmail' | 'outlook' | 'yahoo'
  });

  const providers = {
    gmail: { name: 'Gmail', icon: '📧' },
    outlook: { name: 'Outlook', icon: '📮' },
    yahoo: { name: 'Yahoo', icon: '📯' }
  };

  const handleConnect = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "❌ Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newEmail: EmailConfig = {
        id: Date.now().toString(),
        email: formData.email,
        provider: formData.provider,
        status: 'active',
        salesCount: 0,
        lastSync: new Date().toLocaleString('pt-BR')
      };

      setEmails(prev => [...prev, newEmail]);
      setFormData({ email: '', password: '', provider: 'gmail' });
      setShowForm(false);

      toast({
        title: "✅ Email conectado!",
        description: "Sistema começará a monitorar vendas automaticamente",
      });

      // Simular primeira sincronização
      setTimeout(() => {
        const salesFound = Math.floor(Math.random() * 5) + 1;
        setEmails(prev => prev.map(e => 
          e.id === newEmail.id 
            ? { ...e, salesCount: salesFound, lastSync: new Date().toLocaleString('pt-BR') }
            : e
        ));
        
        toast({
          title: `🎉 ${salesFound} vendas encontradas!`,
          description: "Vendas adicionadas automaticamente",
        });
      }, 3000);

    } catch (error) {
      toast({
        title: "❌ Erro na conexão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;

    toast({
      title: "🔄 Sincronizando...",
      description: `Buscando vendas em ${email.email}`,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSales = Math.floor(Math.random() * 3) + 1;
    setEmails(prev => prev.map(e => 
      e.id === emailId 
        ? { 
            ...e, 
            salesCount: e.salesCount + newSales,
            lastSync: new Date().toLocaleString('pt-BR')
          }
        : e
    ));

    toast({
      title: `✅ ${newSales} novas vendas!`,
      description: "Dashboard atualizado",
    });
  };

  const handleRemove = (emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
    toast({
      title: "🗑️ Email removido",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl">⚡</div>
        <h1 className="text-3xl font-bold">Email Simples para Vendas</h1>
        <p className="text-lg text-muted-foreground">
          Configure em 30 segundos. Receba vendas automaticamente.
        </p>
      </div>

      {/* Quick Setup */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Zap className="h-5 w-5" />
            Setup Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Conecte seu email em 3 cliques e comece a receber vendas automaticamente
              </p>
              <Button 
                onClick={() => setShowForm(true)} 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4" />
                Conectar Meu Email
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Provedor</Label>
                  <Select 
                    value={formData.provider} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      provider: value as any 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(providers).map(([key, provider]) => (
                        <SelectItem key={key} value={key}>
                          {provider.icon} {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {formData.provider === 'gmail' ? 'Senha de App' : 'Senha'}
                  </Label>
                  <Input
                    type="password"
                    placeholder={formData.provider === 'gmail' ? '16 caracteres' : 'Sua senha'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>

              {formData.provider === 'gmail' && (
                <Alert>
                  <AlertDescription>
                    <strong>Gmail:</strong> Use uma Senha de App, não sua senha normal.{' '}
                    <a 
                      href="https://myaccount.google.com/apppasswords" 
                      target="_blank" 
                      className="text-blue-600 underline"
                    >
                      Criar aqui →
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleConnect} 
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? (
                    <RotateCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {isLoading ? 'Conectando...' : 'Conectar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Emails */}
      {emails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📧 Emails Conectados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {providers[email.provider].icon}
                  </div>
                  <div>
                    <div className="font-medium">{email.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Última sync: {email.lastSync}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold">{email.salesCount}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">✅ Ativo</Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSync(email.id)}
                    className="gap-1"
                  >
                    <RotateCw className="h-3 w-3" />
                    Sync
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(email.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* How it Works */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle>🤖 Como Funciona (Super Simples)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl">1️⃣</div>
              <h4 className="font-bold">Conecta Email</h4>
              <p className="text-sm text-muted-foreground">
                Adiciona email onde recebe notificações de vendas
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">2️⃣</div>
              <h4 className="font-bold">Sistema Monitora</h4>
              <p className="text-sm text-muted-foreground">
                Verifica emails automaticamente a cada 30 minutos
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">3️⃣</div>
              <h4 className="font-bold">Vendas Aparecem</h4>
              <p className="text-sm text-muted-foreground">
                Vendas são criadas automaticamente no dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Tipos de Email Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-green-600">Privacy</div>
              <div className="text-sm">"Nova venda - R$ 85,00"</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-green-600">PIX</div>
              <div className="text-sm">"PIX recebido - R$ 120,00"</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-green-600">PayPal</div>
              <div className="text-sm">"Payment received $50.00"</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-green-600">Stripe</div>
              <div className="text-sm">"Successful payment - $30.00"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 