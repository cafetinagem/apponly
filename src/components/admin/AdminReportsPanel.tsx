import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useAdminReports } from '@/hooks/admin/useAdminReports';

const COLORS = ['#F97316', '#fb923c', '#fdba74', '#fed7aa'];

export function AdminReportsPanel() {
  const { 
    reportStats, 
    usersByStatus, 
    modelsByStatus, 
    loading, 
    loadReportStats, 
    exportReport 
  } = useAdminReports();

  useEffect(() => {
    loadReportStats();
  }, [loadReportStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-medium">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (!reportStats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="p-4 bg-accent rounded-xl">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
          </div>
          <p className="text-foreground font-medium">Nenhum dado disponível</p>
          <p className="text-muted-foreground text-sm">Os relatórios serão carregados automaticamente</p>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      title: "Total de Usuários",
      value: reportStats.totalUsers,
      icon: Users,
      color: "#F97316",
      bgColor: "#F3F5F7"
    },
    {
      title: "Usuários Ativos",
      value: reportStats.activeUsers,
      icon: CheckCircle,
      color: "#F97316",
      bgColor: "#F3F5F7"
    },
    {
      title: "Usuários Pendentes",
      value: reportStats.pendingUsers,
      icon: Clock,
      color: "#666666",
      bgColor: "#F3F5F7"
    },
    {
      title: "Total de Modelos",
      value: reportStats.totalModels,
      icon: FileText,
      color: "#F97316",
      bgColor: "#F3F5F7"
    }
  ];

  return (
    <div className="space-elegant">
      {/* Header Profissional */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="heading-elegant text-4xl font-light text-primary">
            Centro de Relatórios
          </h1>
          <p className="text-elegant text-muted-foreground">
            Análise completa de performance e métricas do sistema OnlyCat
          </p>
        </div>
        <Button 
          onClick={() => exportReport('geral')}
          className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="card-elegant bg-card border-border hover:border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-light text-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="h-1 w-8 bg-primary rounded-full"></div>
                    <span className="text-xs text-primary font-medium">Ativo</span>
                  </div>
                </div>
                <div className="p-3 bg-accent rounded-xl border border-border">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Profissionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de Usuários */}
        <div className="card-elegant bg-card border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-border rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="heading-elegant text-lg text-foreground">Distribuição de Usuários</h3>
                <p className="text-sm text-muted-foreground">Por status de aprovação</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="status" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Modelos */}
        <div className="card-elegant bg-card border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-border rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="heading-elegant text-lg text-foreground">Status dos Modelos</h3>
                <p className="text-sm text-muted-foreground">Distribuição por categoria</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modelsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {modelsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-elegant bg-card border-border hover:border-primary/20 cursor-pointer group">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-border rounded-lg group-hover:border-primary/50 transition-colors">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="heading-elegant text-lg text-foreground">Performance Geral</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Taxa de Aprovação</span>
              <span className="text-lg font-light text-primary">
                {reportStats.totalUsers > 0 
                  ? ((reportStats.activeUsers / reportStats.totalUsers) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Eficiência</span>
              <span className="text-lg font-light text-foreground">
                {reportStats.totalTasks > 0 
                  ? ((reportStats.completedTasks / reportStats.totalTasks) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <Link to="/admin/reports/analytics" className="block">
          <div className="card-elegant bg-card border-border hover:border-primary/20 cursor-pointer group h-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 border border-border rounded-lg group-hover:border-primary/50 transition-colors">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="heading-elegant text-lg text-foreground">Analytics Avançados</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-elegant text-muted-foreground mb-4">
                Explore métricas detalhadas e insights profundos sobre o sistema.
              </p>
              <div className="inline-flex items-center text-primary font-medium">
                <span>Acessar Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        <div className="card-elegant bg-card border-border hover:border-primary/20 cursor-pointer group">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-border rounded-lg group-hover:border-primary/50 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="heading-elegant text-lg text-foreground">Auditoria</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-elegant text-muted-foreground mb-4">
              Monitore logs e atividades do sistema em tempo real.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportReport('auditoria')}
              className="btn-elegant w-full border-border hover:border-primary/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
