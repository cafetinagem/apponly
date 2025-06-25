import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Plus,
  Activity,
  CheckCircle2,
  ArrowRight,
  Filter,
  MoreHorizontal,
  Play,
  Pause
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseDashboard } from '@/hooks/useSupabaseDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { 
    taskKPIs, 
    modelKPIs, 
    noteStats, 
    loading: dashboardLoading, 
    refreshDashboard 
  } = useSupabaseDashboard();

  const isLoading = authLoading;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Carregando dashboard...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  // Estatísticas no estilo do dashboard compartilhado
  const taskStats = {
    total: (taskKPIs?.totalTasks || 0),
    inProgress: (taskKPIs?.inProgressTasks || 0),
    completed: (taskKPIs?.completedTasks || 0),
    pending: (taskKPIs?.todoTasks || 0)
  };

  const recentTasks = [
    { 
      id: 1, 
      title: "Revisar cadastro de modelos", 
      status: "Em Execução", 
      priority: "Alta", 
      assignee: user?.email?.split('@')[0] || "Usuário", 
      dueDate: "Hoje" 
    },
    { 
      id: 2, 
      title: "Atualizar notas do sistema", 
      status: "A Fazer", 
      priority: "Média", 
      assignee: "Sistema", 
      dueDate: "Amanhã" 
    },
    { 
      id: 3, 
      title: "Análise de performance", 
      status: "Finalizada", 
      priority: "Baixa", 
      assignee: "Admin", 
      dueDate: "Ontem" 
    },
    { 
      id: 4, 
      title: "Backup de segurança", 
      status: "Em Execução", 
      priority: "Alta", 
      assignee: "Sistema", 
      dueDate: "2 dias" 
    }
  ];

  const projects = [
    { name: "Sistema OnlyCat", progress: 85, tasks: taskStats.total, color: "bg-orange-500" },
    { name: "Gestão de Modelos", progress: 70, tasks: modelKPIs?.totalModels || 0, color: "bg-orange-400" },
    { name: "Base de Conhecimento", progress: 95, tasks: noteStats?.totalNotes || 0, color: "bg-orange-600" }
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header Principal - Estilo Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciamento de Tarefas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie suas tarefas e projetos de forma eficiente
              </p>
            </div>
            <Button 
              onClick={refreshDashboard}
              className="gap-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={dashboardLoading}
            >
              <TrendingUp className="h-4 w-4" />
              {dashboardLoading ? 'Atualizando...' : 'Atualizar Dados'}
            </Button>
          </div>

          {/* Stats Cards - Estilo Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                  <TrendingUp size={16} className="group-hover:animate-bounce text-orange-500" />
                  Total de Tarefas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {taskStats.total}
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-orange-500" />
                  Sistema ativo
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Activity size={16} className="group-hover:animate-pulse text-orange-500" />
                  Em Execução
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {taskStats.inProgress}
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">
                  Ativas no momento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} className="group-hover:animate-spin text-green-500" />
                  Finalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {taskStats.completed}
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">
                  {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}% de conclusão
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                  <Clock size={16} className="group-hover:animate-bounce text-gray-500" />
                  A Fazer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-700 dark:text-slate-300">
                  {taskStats.pending}
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">
                  Aguardando início
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Section - Estilo Dashboard */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Fluxo de Trabalho das Tarefas
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize o progresso das suas tarefas em tempo real
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8 py-8">
                {/* A Fazer */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded-full flex items-center justify-center mb-3 border-2">
                    <CheckSquare className="text-gray-600 dark:text-slate-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">A Fazer</h3>
                  <div className="text-2xl font-bold text-gray-700 dark:text-slate-300 mb-1">
                    {taskStats.pending}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                    Criar e gerenciar tarefas
                  </p>
                </div>

                <ArrowRight className="text-gray-400 dark:text-slate-600" size={24} />

                {/* Em Execução */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <Clock className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Em Execução</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {taskStats.inProgress}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                    Tarefas em andamento
                  </p>
                </div>

                <ArrowRight className="text-gray-400 dark:text-slate-600" size={24} />

                {/* Finalizadas */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 rounded-full flex items-center justify-center mb-3 border-2">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Finalizadas</h3>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {taskStats.completed}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                    Tarefas concluídas
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 justify-center mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link to="/tasks">
                  <Button variant="outline" className="gap-2 border-gray-300 dark:border-slate-600">
                    <Calendar size={16} />
                    Visão Geral
                  </Button>
                </Link>
                <Link to="/tasks/todo">
                  <Button variant="outline" className="gap-2 border-gray-300 dark:border-slate-600">
                    <CheckSquare size={16} />
                    A Fazer
                  </Button>
                </Link>
                <Link to="/tasks/in-progress">
                  <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                    <Clock size={16} />
                    Em Execução
                  </Button>
                </Link>
                <Link to="/tasks/completed">
                  <Button variant="outline" className="gap-2 border-gray-300 dark:border-slate-600">
                    <CheckCircle2 size={16} />
                    Finalizadas
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                    <Plus size={16} />
                    Nova Tarefa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks and Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Tarefas Recentes
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Últimas atividades do seu sistema
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-slate-600">
                  <Filter size={14} />
                  Filtrar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'Em Execução' ? 'bg-orange-500' :
                      task.status === 'Finalizada' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={task.status === 'Em Execução' ? 'default' : 'secondary'}
                          className={task.status === 'Em Execução' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300'}
                        >
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {task.assignee}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        {task.dueDate}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-600">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects Progress */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Progresso dos Projetos
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Acompanhe o andamento dos seus módulos
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {project.progress}%
                        </span>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                          {project.tasks} itens
                        </p>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
                
                <Link to="/models/register">
                  <Button variant="outline" className="w-full gap-2 mt-4 border-gray-300 dark:border-slate-600">
                    <Plus size={16} />
                    Novo Módulo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
