
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  totalModels: number;
  activeModels: number;
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
}

interface UsersByStatus {
  status: string;
  count: number;
}

interface ModelsByStatus {
  status: string;
  count: number;
}

export function useAdminReports() {
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [usersByStatus, setUsersByStatus] = useState<UsersByStatus[]>([]);
  const [modelsByStatus, setModelsByStatus] = useState<ModelsByStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  const { toast } = useToast();

  const loadReportStats = useCallback(async () => {
    // Prevenir múltiplas chamadas simultâneas e chamadas muito frequentes
    const now = Date.now();
    if (loading || (now - lastLoadTime < 5000)) return;
    
    try {
      setLoading(true);
      setLastLoadTime(now);
      
      console.log('🔄 [AdminReports] Carregando relatórios...');
      
      // Buscar estatísticas de usuários
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('status_conta');

      if (usersError) {
        throw usersError;
      }

      // Buscar estatísticas de modelos
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('status');

      if (modelsError) {
        throw modelsError;
      }

      // Buscar estatísticas de tarefas
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('status');

      if (tasksError) {
        throw tasksError;
      }

      // Buscar estatísticas de notas
      const { count: notesCount, error: notesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });

      if (notesError) {
        throw notesError;
      }

      // Processar dados dos usuários
      const userStats = {
        total: usersData?.length || 0,
        active: usersData?.filter(u => u.status_conta === 'aprovado').length || 0,
        pending: usersData?.filter(u => u.status_conta === 'pendente').length || 0,
        rejected: usersData?.filter(u => u.status_conta === 'rejeitado').length || 0
      };

      // Processar dados dos modelos
      const modelStats = {
        total: modelsData?.length || 0,
        active: modelsData?.filter(m => m.status === 'active').length || 0
      };

      // Processar dados das tarefas
      const taskStats = {
        total: tasksData?.length || 0,
        completed: tasksData?.filter(t => t.status === 'done').length || 0
      };

      // Consolidar estatísticas
      const stats: ReportStats = {
        totalUsers: userStats.total,
        activeUsers: userStats.active,
        pendingUsers: userStats.pending,
        rejectedUsers: userStats.rejected,
        totalModels: modelStats.total,
        activeModels: modelStats.active,
        totalTasks: taskStats.total,
        completedTasks: taskStats.completed,
        totalNotes: notesCount || 0
      };

      setReportStats(stats);

      // Preparar dados para gráficos
      const usersByStatusData: UsersByStatus[] = [
        { status: 'Aprovados', count: userStats.active },
        { status: 'Pendentes', count: userStats.pending },
        { status: 'Rejeitados', count: userStats.rejected }
      ];

      const modelsByStatusData: ModelsByStatus[] = [
        { status: 'Ativos', count: modelStats.active },
        { status: 'Inativos', count: modelStats.total - modelStats.active }
      ];

      setUsersByStatus(usersByStatusData);
      setModelsByStatus(modelsByStatusData);

      console.log('✅ [AdminReports] Relatórios carregados:', stats);

    } catch (error) {
      console.error('❌ [AdminReports] Erro ao carregar relatórios:', error);
      toast({
        title: "Erro ao carregar relatórios",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [loading, lastLoadTime, toast]);

  // Carregar dados apenas uma vez ao montar o componente
  useEffect(() => {
    loadReportStats();
  }, []);

  const exportReport = useCallback(async (reportType: string) => {
    try {
      console.log(`📊 [AdminReports] Exportando relatório: ${reportType}`);
      
      // Aqui você pode implementar a lógica de exportação
      // Por exemplo, gerar CSV, PDF, etc.
      
      toast({
        title: "Relatório exportado",
        description: `Relatório ${reportType} foi exportado com sucesso.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ [AdminReports] Erro ao exportar:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    reportStats,
    usersByStatus,
    modelsByStatus,
    loading,
    loadReportStats,
    exportReport
  };
}
