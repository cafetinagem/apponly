import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserApprovalCard } from './UserApprovalCard';
import { UserApprovalHeader } from './UserApprovalHeader';
import { UserApprovalLoader } from './UserApprovalLoader';
import { CheckCircle, XCircle, Clock, AlertTriangle, Mail, Settings, Users, TrendingUp } from 'lucide-react';

interface LocalUserProfile {
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

export function UserApprovalPanel() {
  const [users, setUsers] = useState<LocalUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadUsers();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      const { data, error: queryError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (queryError) throw queryError;
      setUsers((data || []) as LocalUserProfile[]);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Automatic notification system
  const sendNotificationEmail = async (userEmail: string, userName: string, action: 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase.functions.invoke('send-approval-notification', {
        body: {
          userEmail,
          userName,
          action,
          adminEmail: 'onlycatbrasil@gmail.com'
        },
      });

      if (error) throw error;
      
      console.log('✅ Email de notificação enviado:', data);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  };

  const updateUserStatus = useCallback(async (userId: string, newStatus: 'aprovado' | 'rejeitado') => {
    if (processingUsers.has(userId)) return;

    setProcessingUsers(prev => new Set(prev).add(userId));

    try {
      const user = users.find(u => u.user_id === userId);
      if (!user) throw new Error('Usuário não encontrado');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          status_conta: newStatus,
          data_aprovacao: new Date().toISOString(),
          aprovado_por: 'onlycatbrasil@gmail.com'
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Send automatic notification
      const emailSent = await sendNotificationEmail(
        user.email, 
        user.nome || 'Usuário', 
        newStatus === 'aprovado' ? 'approved' : 'rejected'
      );

      // Update local state
      setUsers(prev => prev.map(u => 
        u.user_id === userId 
          ? { 
              ...u, 
              status_conta: newStatus, 
              data_aprovacao: new Date().toISOString(),
              aprovado_por: 'onlycatbrasil@gmail.com' 
            }
          : u
      ));

      toast({
        title: newStatus === 'aprovado' ? "✅ Usuário aprovado!" : "❌ Usuário rejeitado!",
        description: `${user.nome || user.email} foi ${newStatus}${emailSent ? ' e notificado por email' : ''}.`,
      });

    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [users, processingUsers, toast]);

  const pendingUsers = users.filter(user => user.status_conta === 'pendente');
  const approvedUsers = users.filter(user => user.status_conta === 'aprovado');
  const rejectedUsers = users.filter(user => user.status_conta === 'rejeitado');

  if (loading) return <UserApprovalLoader />;

  return (
    <div className="space-y-6">
      <UserApprovalHeader 
        pendingCount={pendingUsers.length}
        approvedCount={approvedUsers.length}
        rejectedCount={rejectedUsers.length}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                <p className="text-sm text-gray-600">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedUsers.length}</p>
                <p className="text-sm text-gray-600">Aprovados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{rejectedUsers.length}</p>
                <p className="text-sm text-gray-600">Rejeitados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-refresh Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Atualização Automática</span>
            </div>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Ativada' : 'Desativada'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Sistema de Notificações</span>
          </CardTitle>
          <CardDescription>
            Emails automáticos enviados para usuários aprovados/rejeitados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Aprovações</p>
              <p className="text-xs text-green-600 dark:text-green-400">Email automático enviado</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Rejeições</p>
              <p className="text-xs text-red-600 dark:text-red-400">Email automático enviado</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Admin</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">onlycatbrasil@gmail.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span>Usuários Pendentes ({pendingUsers.length})</span>
          </CardTitle>
          <CardDescription>
            Usuários aguardando aprovação manual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Tudo em dia! 🎉
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Não há usuários pendentes de aprovação no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <UserApprovalCard
                  key={user.id}
                  user={{
                    ...user,
                    role: (user.role as 'admin' | 'executor' | 'modelo') || 'modelo'
                  }}
                  onApprove={() => updateUserStatus(user.user_id, 'aprovado')}
                  onReject={() => updateUserStatus(user.user_id, 'rejeitado')}
                  onDelete={() => {}}
                  onPromoteToAdmin={() => {}}
                  isProcessing={processingUsers.has(user.user_id)}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {(approvedUsers.length > 0 || rejectedUsers.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações de aprovação/rejeição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...approvedUsers, ...rejectedUsers]
                .sort((a, b) => new Date(b.data_aprovacao || b.updated_at).getTime() - new Date(a.data_aprovacao || a.updated_at).getTime())
                .slice(0, 5)
                .map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {user.status_conta === 'aprovado' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{user.nome || user.email}</p>
                        <p className="text-sm text-gray-500">
                          {user.status_conta === 'aprovado' ? 'Aprovado' : 'Rejeitado'} em{' '}
                          {new Date(user.data_aprovacao || user.updated_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={user.status_conta === 'aprovado' ? 'default' : 'destructive'}>
                      {user.status_conta}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
