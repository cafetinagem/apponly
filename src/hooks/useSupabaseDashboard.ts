import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TaskKPIs {
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  totalTasks: number;
  productivityScore: number;
  totalTimeSpent: number;
}

interface ModelKPIs {
  totalModels: number;
  activeModels: number;
  totalSessions: number;
  upcomingSessions: number;
  averageRating: number;
}

interface NoteStats {
  totalNotes: number;
  todayNotes: number;
  totalCategories: number;
}

export function useSupabaseDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false); // Começar sem loading
  const [taskKPIs, setTaskKPIs] = useState<TaskKPIs>({
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalTasks: 0,
    productivityScore: 0,
    totalTimeSpent: 0
  });
  const [modelKPIs, setModelKPIs] = useState<ModelKPIs>({
    totalModels: 0,
    activeModels: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    averageRating: 0
  });
  const [noteStats, setNoteStats] = useState<NoteStats>({
    totalNotes: 0,
    todayNotes: 0,
    totalCategories: 0
  });

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Carregar dados em paralelo com timeout
      const promises = [
        // Tasks
        Promise.race([
          supabase
            .from('tasks')
            .select('status, time_spent')
            .eq('user_id', user.id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]),
        // Models
        Promise.race([
          supabase
            .from('models')
            .select('status')
            .eq('user_id', user.id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]),
        // Notes
        Promise.race([
          supabase
            .from('notes')
            .select('created_at, category_id')
            .eq('user_id', user.id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ])
      ];

      const results = await Promise.allSettled(promises);
      
      // Processar tasks
      if (results[0].status === 'fulfilled') {
        const tasks = results[0].value.data || [];
        const todoTasks = tasks.filter((t: any) => t.status === 'todo').length;
        const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
        const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
        const totalTasks = tasks.length;
        const totalTimeSpent = tasks.reduce((sum: number, t: any) => sum + (t.time_spent || 0), 0);
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setTaskKPIs({
          todoTasks,
          inProgressTasks,
          completedTasks,
          totalTasks,
          productivityScore,
          totalTimeSpent
        });
      }

      // Processar models
      if (results[1].status === 'fulfilled') {
        const models = results[1].value.data || [];
        const totalModels = models.length;
        const activeModels = models.filter((m: any) => m.status === 'active').length;

        setModelKPIs(prev => ({
          ...prev,
          totalModels,
          activeModels
        }));
      }

      // Processar notes
      if (results[2].status === 'fulfilled') {
        const notes = results[2].value.data || [];
        const totalNotes = notes.length;
        const today = new Date().toISOString().split('T')[0];
        const todayNotes = notes.filter((n: any) => 
          n.created_at?.startsWith(today)
        ).length;
        const totalCategories = new Set(notes.map((n: any) => n.category_id).filter(Boolean)).size;

        setNoteStats({
          totalNotes,
          todayNotes,
          totalCategories
        });
      }

    } catch (error) {
      console.warn('Erro ao carregar dashboard, usando dados padrão:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar dados apenas quando necessário
  useEffect(() => {
    if (user) {
      // Carregar em background sem bloquear UI
      setTimeout(loadDashboardData, 100);
    }
  }, [user, loadDashboardData]);

  const refreshDashboard = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    taskKPIs,
    modelKPIs,
    noteStats,
    loading,
    refreshDashboard
  };
}
