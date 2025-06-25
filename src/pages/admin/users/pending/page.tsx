import React, { useState } from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, UserX, UserCheck, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingUser {
  id: string;
  user_id: string;
  email: string;
  nome: string | null;
  role: string;
  data_cadastro: string;
  status_conta: string;
}

export default function AdminPendingUsersPage() {
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: ['admin-pending-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('status_conta', 'pendente')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      return data as PendingUser[];
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'aprovado' | 'rejeitado' }) => {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          status_conta: status,
          data_aprovacao: new Date().toISOString(),
          aprovado_por: 'Administrador'
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: variables.status === 'aprovado' ? "✅ Usuário Aprovado" : "❌ Usuário Rejeitado",
        description: `Usuário foi ${variables.status} com sucesso!`,
        variant: variables.status === 'aprovado' ? "default" : "destructive"
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive"
      });
    },
    onSettled: () => setProcessingUser(null)
  });

  const handleApprove = (userId: string) => {
    setProcessingUser(userId);
    updateUserMutation.mutate({ userId, status: 'aprovado' });
  };

  const handleReject = (userId: string) => {
    setProcessingUser(userId);
    updateUserMutation.mutate({ userId, status: 'rejeitado' });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrador', variant: 'destructive' as const },
      executor: { label: 'Executor', variant: 'default' as const },
      modelo: { label: 'Modelo', variant: 'secondary' as const }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <MainLayout>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </MainLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  Usuários Pendentes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {pendingUsers.length} usuários aguardando aprovação
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          {/* Alert */}
          {pendingUsers.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Ação Necessária
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Existem {pendingUsers.length} usuários aguardando aprovação manual.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Usuários Aguardando Aprovação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum usuário pendente encontrado</p>
                  <p className="text-sm mt-2">Todos os usuários foram processados!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.nome || 'Nome não informado'}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Cadastrado em {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getRoleBadge(user.role)}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(user.user_id)}
                              disabled={processingUser === user.user_id}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              {processingUser === user.user_id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Rejeitar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.user_id)}
                              disabled={processingUser === user.user_id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingUser === user.user_id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Aprovar
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AdminRoute>
  );
} 