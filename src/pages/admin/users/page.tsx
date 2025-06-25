import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { UserApprovalPanel } from '@/components/admin/UserApprovalPanel';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  UserCheck, 
  UserX, 
  Shield, 
  Ban, 
  CheckCircle,
  RotateCcw,
  Eye,
  Settings,
  Search,
  Filter,
  Download,
  Loader2,
  RefreshCw,
  Key,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  user_id: string;
  status_conta: 'pendente' | 'aprovado' | 'rejeitado';
  email: string;
  nome: string | null;
  data_cadastro: string;
  data_aprovacao: string | null;
  aprovado_por: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface PasswordResetInfo {
  email: string;
  temporaryPassword: string;
  expiresAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [passwordResetInfo, setPasswordResetInfo] = useState<PasswordResetInfo | null>(null);

  // Carregar usuários na inicialização
  useEffect(() => {
    loadAllUsers();
    
    // Configurar realtime subscription
    const channel = supabase
      .channel('admin-users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('🔄 [AdminUsers] Realtime update:', payload);
          if (autoRefresh) {
            loadAllUsers();
          }
        }
      )
      .subscribe();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadAllUsers();
      }
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filtrar usuários baseado na busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(userProfiles);
    } else {
      const filtered = userProfiles.filter(profile =>
        profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.status_conta.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userProfiles, searchTerm]);

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 [AdminUsers] Carregando usuários...');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;

      const typedProfiles: UserProfile[] = (data || []).map(profile => ({
        ...profile,
        status_conta: profile.status_conta as 'pendente' | 'aprovado' | 'rejeitado'
      }));

      setUserProfiles(typedProfiles);
      setLastUpdate(new Date());
      console.log(`✅ [AdminUsers] ${typedProfiles.length} usuários carregados`);
    } catch (error) {
      console.error('❌ [AdminUsers] Erro ao carregar usuários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar lista de usuários"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      console.log('✅ [AdminUsers] Aprovando usuário:', userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          status_conta: 'aprovado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: user?.id,
          motivo_rejeicao: null
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "✅ Usuário aprovado",
        description: "Status atualizado com sucesso"
      });

      loadAllUsers();
    } catch (error) {
      console.error('❌ [AdminUsers] Erro ao aprovar:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao aprovar usuário"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const rejectUser = async (userId: string, reason: string = 'Não especificado') => {
    try {
      setActionLoading(userId);
      console.log('❌ [AdminUsers] Rejeitando usuário:', userId);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          status_conta: 'rejeitado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: user?.id
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "❌ Usuário rejeitado",
        description: "Status atualizado com sucesso"
      });

      loadAllUsers();
    } catch (error) {
      console.error('❌ [AdminUsers] Erro ao rejeitar:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao rejeitar usuário"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const reactivateUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      console.log('🔄 [AdminUsers] Reativando usuário:', userId);
      
      // Primeiro, verificar se o usuário existe
      const { data: existingUser, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (selectError) {
        console.error('❌ [AdminUsers] Erro ao buscar usuário:', selectError);
        throw new Error(`Usuário não encontrado: ${selectError.message}`);
      }

      console.log('📋 [AdminUsers] Usuário encontrado:', existingUser);

      // Atualizar o status
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          status_conta: 'aprovado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: user?.id
        })
        .eq('user_id', userId)
        .select();

      if (updateError) {
        console.error('❌ [AdminUsers] Erro ao atualizar:', updateError);
        throw updateError;
      }

      console.log('✅ [AdminUsers] Usuário reativado com sucesso:', updateData);

      toast({
        title: "🔄 Usuário reativado",
        description: `${existingUser.nome || existingUser.email} foi reativado com sucesso`
      });

      // Recarregar dados
      await loadAllUsers();
    } catch (error) {
      console.error('❌ [AdminUsers] Erro ao reativar:', error);
      toast({
        variant: "destructive",
        title: "Erro ao reativar",
        description: error instanceof Error ? error.message : "Falha ao reativar usuário"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const suspendUser = async (userId: string, reason: string = 'Suspensão administrativa') => {
    try {
      setActionLoading(userId);
      console.log('🚫 [AdminUsers] Suspendendo usuário:', userId);
      
      // Primeiro, verificar se o usuário existe
      const { data: existingUser, error: selectError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (selectError) {
        console.error('❌ [AdminUsers] Erro ao buscar usuário:', selectError);
        throw new Error(`Usuário não encontrado: ${selectError.message}`);
      }

      console.log('📋 [AdminUsers] Usuário encontrado:', existingUser);

      // Atualizar o status
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          status_conta: 'rejeitado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: user?.id
        })
        .eq('user_id', userId)
        .select();

      if (updateError) {
        console.error('❌ [AdminUsers] Erro ao atualizar:', updateError);
        throw updateError;
      }

      console.log('✅ [AdminUsers] Usuário suspenso com sucesso:', updateData);

      toast({
        title: "🚫 Usuário suspenso",
        description: `${existingUser.nome || existingUser.email} foi suspenso com sucesso`
      });

      // Recarregar dados
      await loadAllUsers();
    } catch (error) {
      console.error('❌ [AdminUsers] Erro ao suspender:', error);
      toast({
        variant: "destructive",
        title: "Erro ao suspender",
        description: error instanceof Error ? error.message : "Falha ao suspender usuário"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const exportUserData = async () => {
    try {
      const csvContent = [
        'Nome,Email,Status,Data Cadastro,Data Aprovação,Role',
        ...filteredUsers.map(user => 
          `"${user.nome || ''}","${user.email}","${user.status_conta}","${formatDate(user.data_cadastro)}","${user.data_aprovacao ? formatDate(user.data_aprovacao) : ''}","${user.role || ''}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "📊 Dados exportados",
        description: "Arquivo CSV baixado com sucesso"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao exportar dados"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-primary">Aprovado</span>
          </div>
        );
      case 'rejeitado':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent border border-border">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
            <span className="text-xs font-medium text-muted-foreground">Rejeitado</span>
          </div>
        );
      case 'pendente':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent border border-border">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-muted-foreground">Pendente</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent border border-border">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
            <span className="text-xs font-medium text-muted-foreground">Desconhecido</span>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const approvedUsers = filteredUsers.filter(u => u.status_conta === 'aprovado');
  const rejectedUsers = filteredUsers.filter(u => u.status_conta === 'rejeitado');
  const pendingUsers = filteredUsers.filter(u => u.status_conta === 'pendente');

  // Gerar senha temporária
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Resetar senha do usuário
  const resetUserPassword = async (profile: UserProfile) => {
    try {
      setActionLoading(profile.user_id);
      console.log('🔑 [AdminUsers] Resetando senha para:', profile.email);
      
      // Gerar nova senha temporária
      const temporaryPassword = generateTemporaryPassword();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas
      
      // Usar o admin API para resetar a senha
      const { error } = await supabase.auth.admin.updateUserById(
        profile.user_id,
        { 
          password: temporaryPassword,
          email_confirm: true // Confirmar email automaticamente
        }
      );

      if (error) {
        console.error('❌ [AdminUsers] Erro ao resetar senha:', error);
        throw error;
      }

      // Salvar informações da senha temporária
      setPasswordResetInfo({
        email: profile.email,
        temporaryPassword,
        expiresAt
      });

      toast({
        title: "🔑 Senha resetada com sucesso",
        description: `Nova senha temporária gerada para ${profile.email}`,
        duration: 5000
      });

      console.log('✅ [AdminUsers] Senha resetada com sucesso para:', profile.email);
      
    } catch (error: any) {
      console.error('❌ [AdminUsers] Erro ao resetar senha:', error);
      toast({
        variant: "destructive",
        title: "Erro ao resetar senha",
        description: error.message || "Falha ao resetar senha do usuário"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Copiar senha temporária
  const copyTemporaryPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "📋 Senha copiada",
        description: "Senha temporária copiada para área de transferência",
        duration: 3000
      });
    } catch (error) {
      console.error('❌ Erro ao copiar senha:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao copiar senha"
      });
    }
  };

  const showUserDetails = (profile: UserProfile) => {
    console.log('👤 [AdminUsers] Exibindo detalhes do usuário:', profile);
    
    const details = [
      `📧 Email: ${profile.email}`,
      `👤 Nome: ${profile.nome || 'Não informado'}`,
      ` Status: ${profile.status_conta}`,
      `🎭 Role: ${profile.role || 'Não definido'}`,
      `📅 Cadastro: ${formatDate(profile.data_cadastro)}`,
      profile.data_aprovacao ? `⏰ Última ação: ${formatDate(profile.data_aprovacao)}` : '',
      `🆔 ID: ${profile.user_id}`
    ].filter(Boolean).join('\n');

    toast({
      title: `👤 ${profile.nome || profile.email}`,
      description: details,
      duration: 8000 // 8 segundos para dar tempo de ler
    });
  };

  if (loading && userProfiles.length === 0) {
    return (
      <AdminRoute>
        <MainLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-gray-600">Carregando usuários...</p>
            </div>
          </div>
        </MainLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header com controles */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                Gerenciamento de Usuários
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Última atualização: {formatDate(lastUpdate.toISOString())}
                {autoRefresh && (
                  <span className="ml-2 inline-flex items-center">
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Auto-refresh ativo
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh
              </Button>
              <Button onClick={loadAllUsers} variant="outline" size="sm" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                Atualizar
              </Button>
              <Button onClick={exportUserData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Busca e filtros */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredUsers.length} de {userProfiles.length} usuários
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold">{userProfiles.length}</p>
                    <p className="text-xs text-gray-500">
                      {searchTerm && `${filteredUsers.length} filtrados`}
                    </p>
                  </div>
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</p>
                    <p className="text-xs text-yellow-600">
                      {pendingUsers.length > 0 ? 'Requer ação' : 'Nenhum pendente'}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">{approvedUsers.length}</p>
                    <p className="text-xs text-green-600">
                      {userProfiles.length > 0 ? `${Math.round((approvedUsers.length / userProfiles.length) * 100)}% do total` : '0%'}
                    </p>
                  </div>
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejeitados</p>
                    <p className="text-2xl font-bold text-red-600">{rejectedUsers.length}</p>
                    <p className="text-xs text-red-600">
                      {rejectedUsers.length > 0 ? 'Podem ser reativados' : 'Nenhum rejeitado'}
                    </p>
                  </div>
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/admin/users/pending">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">Usuários Pendentes</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Gerenciar aprovações pendentes
                      </p>
                      {pendingUsers.length > 0 && (
                        <Badge className="mt-2 bg-yellow-100 text-yellow-700">
                          {pendingUsers.length} aguardando
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin/users/approved">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">Usuários Aprovados</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Visualizar usuários ativos
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-700">
                        {approvedUsers.length} ativos
                      </Badge>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* User Management Tabs */}
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="relative">
                Pendentes ({pendingUsers.length})
                {pendingUsers.length > 0 && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Aprovados ({approvedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejeitados ({rejectedUsers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <UserApprovalPanel />
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Usuários Aprovados - Controles Administrativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Nenhum usuário aprovado encontrado</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                          Tente ajustar os filtros de busca
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {approvedUsers.map((profile) => (
                        <div key={profile.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div>
                                  <h3 className="font-medium">
                                    {profile.nome || profile.email}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {profile.email}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span>📅 Cadastro: {formatDate(profile.data_cadastro)}</span>
                                    {profile.data_aprovacao && (
                                      <span>✅ Aprovado: {formatDate(profile.data_aprovacao)}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {getStatusBadge(profile.status_conta)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showUserDetails(profile)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    disabled={actionLoading === profile.user_id}
                                  >
                                    {actionLoading === profile.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Key className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <Key className="h-5 w-5 text-blue-600" />
                                      🔑 Resetar Senha do Usuário
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja resetar a senha de <strong>{profile.nome || profile.email}</strong>?
                                      <br />
                                      <br />
                                      ⚠️ <strong>Importante:</strong>
                                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                        <li>Uma nova senha temporária será gerada</li>
                                        <li>A senha atual será invalidada imediatamente</li>
                                        <li>O usuário precisará usar a nova senha para fazer login</li>
                                        <li>A senha temporária expira em 24 horas</li>
                                      </ul>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => resetUserPassword(profile)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Key className="h-4 w-4 mr-2" />
                                      Resetar Senha
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={actionLoading === profile.user_id}
                                  >
                                    {actionLoading === profile.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Ban className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>🚫 Suspender Usuário</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja suspender o acesso de <strong>{profile.nome || profile.email}</strong>?
                                      <br />
                                      Esta ação pode ser revertida posteriormente.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => suspendUser(profile.user_id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Suspender
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-red-600" />
                    Usuários Rejeitados - Controles de Reativação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rejectedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Nenhum usuário rejeitado encontrado</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                          Tente ajustar os filtros de busca
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rejectedUsers.map((profile) => (
                        <div key={profile.id} className="border rounded-lg p-4 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div>
                                  <h3 className="font-medium">
                                    {profile.nome || profile.email}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {profile.email}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span>📅 Cadastro: {formatDate(profile.data_cadastro)}</span>
                                    {profile.data_aprovacao && (
                                      <span>❌ Rejeitado: {formatDate(profile.data_aprovacao)}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {getStatusBadge(profile.status_conta)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showUserDetails(profile)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    disabled={actionLoading === profile.user_id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {actionLoading === profile.user_id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>🔄 Reativar Usuário</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja reativar o acesso de <strong>{profile.nome || profile.email}</strong>?
                                      <br />
                                      O usuário receberá status de aprovado.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => reactivateUser(profile.user_id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Reativar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Modal para exibir senha temporária */}
          {passwordResetInfo && (
            <Dialog open={!!passwordResetInfo} onOpenChange={() => setPasswordResetInfo(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-green-600" />
                    🔑 Senha Temporária Gerada
                  </DialogTitle>
                  <DialogDescription>
                    Nova senha temporária para <strong>{passwordResetInfo.email}</strong>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                          Senha temporária:
                        </p>
                        <code className="text-lg font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border select-all">
                          {passwordResetInfo.temporaryPassword}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyTemporaryPassword(passwordResetInfo.temporaryPassword)}
                        className="ml-3"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          ⚠️ Instruções importantes:
                        </p>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                          <li>• Envie esta senha para o usuário por canal seguro</li>
                          <li>• A senha expira em 24 horas</li>
                          <li>• O usuário deve alterar a senha no primeiro login</li>
                          <li>• A senha anterior foi invalidada</li>
                        </ul>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                          Expira em: {new Date(passwordResetInfo.expiresAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => copyTemporaryPassword(passwordResetInfo.temporaryPassword)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Senha
                  </Button>
                  <Button onClick={() => setPasswordResetInfo(null)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </MainLayout>
    </AdminRoute>
  );
}
