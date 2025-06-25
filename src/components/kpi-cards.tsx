
import { Card } from '@/components/ui/card';
import { TaskKPIs, ModelKPIs } from '@/lib/types';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar
} from 'lucide-react';

interface TaskKPICardsProps {
  kpis: TaskKPIs;
}

export function TaskKPICards({ kpis }: TaskKPICardsProps) {
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CheckSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.totalTasks}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Em Progresso</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.inProgressTasks}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tempo Gasto</p>
            <p className="text-2xl font-bold text-gray-900">{formatTime(kpis.totalTimeSpent)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <CheckSquare className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Concluídas</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.completedTasks}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ModelKPICardsProps {
  kpis: ModelKPIs;
}

export function ModelKPICards({ kpis }: ModelKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Users className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Modelos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.activeModels}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Próximas Sessões</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.upcomingSessions}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
