import React from 'react';
import { Link } from 'react-router-dom';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3,
  ArrowRight,
  UserCheck,
  FileText,
  Database,
  Loader2
} from 'lucide-react';
import { useAdminReports } from '@/hooks/admin/useAdminReports';

export default function AdminPage() {
  const { reportStats, loading } = useAdminReports();

  const adminSections = [
    {
      title: "Gerenciamento de Usuários",
      description: "Aprovar, rejeitar e gerenciar usuários do sistema",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      stats: loading ? "Carregando..." : `Pendentes: ${reportStats?.pendingUsers || 0}`
    },
    {
      title: "Relatórios do Sistema",
      description: "Visualizar relatórios detalhados e estatísticas",
      icon: BarChart3,
      path: "/admin/reports",
      color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      stats: loading ? "Carregando..." : `${reportStats?.totalUsers || 0} usuários`
    },
    {
      title: "Configurações",
      description: "Configurar parâmetros do sistema e segurança",
      icon: Settings,
      path: "/admin/settings",
      color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      stats: "Sistema ativo"
    }
  ];

  const quickStats = [
    {
      title: "Usuários Ativos",
      value: loading ? "..." : reportStats?.activeUsers?.toLocaleString() || "0",
      change: "+12%",
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Modelos Cadastrados",
      value: loading ? "..." : reportStats?.totalModels?.toString() || "0",
      change: "+5%",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Tarefas Completas",
      value: loading ? "..." : reportStats?.completedTasks?.toString() || "0",
      change: "+23%",
      icon: Database,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  // Atividade recente baseada nos dados reais
  const recentActivity = [
    { 
      action: "Usuários pendentes", 
      user: `${reportStats?.pendingUsers || 0} aguardando aprovação`, 
      time: "agora" 
    },
    { 
      action: "Usuários ativos", 
      user: `${reportStats?.activeUsers || 0} usuários aprovados`, 
      time: "tempo real" 
    },
    { 
      action: "Modelos cadastrados", 
      user: `${reportStats?.totalModels || 0} modelos no sistema`, 
      time: "total" 
    },
    { 
      action: "Notas criadas", 
      user: `${reportStats?.totalNotes || 0} notas salvas`, 
      time: "total" 
    }
  ];

  return (
    <AdminRoute>
      <MainLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie todos os aspectos do sistema
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              {loading && <Loader2 className="h-5 w-5 animate-spin text-orange-600" />}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      <p className={`text-sm ${stat.color}`}>
                        {stat.change} vs mês anterior
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {section.stats}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={section.path}>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      variant="default"
                    >
                      Acessar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Estatísticas do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
              
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                  <span className="ml-2 text-sm text-gray-600">Carregando dados do sistema...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AdminRoute>
  );
}
