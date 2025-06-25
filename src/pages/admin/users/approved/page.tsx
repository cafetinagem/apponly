import React from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, UserCheck, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ApprovedUser {
  id: string;
  user_id: string;
  email: string;
  nome: string | null;
  role: string;
  data_cadastro: string;
  data_aprovacao: string | null;
  aprovado_por: string | null;
}

export default function AdminApprovedUsersPage() {
  const { data: approvedUsers = [], isLoading } = useQuery({
    queryKey: ['admin-approved-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('status_conta', 'aprovado')
        .order('data_aprovacao', { ascending: false });

      if (error) throw error;
      return data as ApprovedUser[];
    }
  });

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
                  Usuários Aprovados
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {approvedUsers.length} usuários aprovados no sistema
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">{approvedUsers.length}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administradores</p>
                    <p className="text-2xl font-bold text-red-600">
                      {approvedUsers.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Executores</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {approvedUsers.filter(u => u.role === 'executor').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Modelos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {approvedUsers.filter(u => u.role === 'modelo').length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Lista de Usuários Aprovados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum usuário aprovado encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.nome || 'Nome não informado'}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </span>
                              {user.data_aprovacao && (
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Aprovado em {new Date(user.data_aprovacao).toLocaleDateString('pt-BR')}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getRoleBadge(user.role)}
                          {user.aprovado_por && (
                            <div className="text-xs text-gray-500">
                              por {user.aprovado_por}
                            </div>
                          )}
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