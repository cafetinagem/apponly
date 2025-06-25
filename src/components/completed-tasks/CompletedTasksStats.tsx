
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Calendar,
  User,
  Monitor
} from 'lucide-react';

interface TaskStats {
  totalCompleted: number;
  totalTimeSpent: number;
  averageTimePerTask: number;
  productivityScore: number;
  platformStats: Array<{
    platform: string;
    count: number;
    percentage: number;
  }>;
  assigneeStats: Array<{
    assignee: string;
    count: number;
    percentage: number;
  }>;
}

interface CompletedTasksStatsProps {
  statistics: TaskStats;
}

export function CompletedTasksStats({ statistics }: CompletedTasksStatsProps) {
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCompleted}</div>
            <p className="text-xs text-gray-500">tarefas finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.productivityScore}%</div>
            <p className="text-xs text-gray-500">score de eficiência</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(statistics.totalTimeSpent)}</div>
            <p className="text-xs text-gray-500">
              Média: {formatTime(statistics.averageTimePerTask)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(statistics.averageTimePerTask)}</div>
            <p className="text-xs text-gray-500">por tarefa</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform and Assignee Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Por Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.platformStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{stat.platform}</Badge>
                    <span className="text-sm">{stat.count} tarefas</span>
                  </div>
                  <span className="text-sm font-medium">{stat.percentage}%</span>
                </div>
              ))}
              {statistics.platformStats.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma plataforma especificada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Por Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.assigneeStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{stat.assignee}</Badge>
                    <span className="text-sm">{stat.count} tarefas</span>
                  </div>
                  <span className="text-sm font-medium">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
