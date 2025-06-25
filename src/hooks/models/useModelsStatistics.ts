
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ModelKPIs {
  totalModels: number;
  activeModels: number;
  totalSessions: number;
  upcomingSessions: number;
  averageRating: number;
}

export function useModelsStatistics() {
  const { user } = useAuth();

  const getModelStatistics = useCallback(async (): Promise<ModelKPIs> => {
    if (!user?.id) {
      return {
        totalModels: 0,
        activeModels: 0,
        totalSessions: 0,
        upcomingSessions: 0,
        averageRating: 0
      };
    }

    try {
      const [modelStatsResult, sessionStatsResult] = await Promise.all([
        supabase
          .from('models')
          .select('status')
          .eq('user_id', user.id),
        supabase
          .from('model_sessions')
          .select('status, rating, date')
          .eq('user_id', user.id)
      ]);

      const { data: modelStats, error: modelError } = modelStatsResult;
      const { data: sessionStats, error: sessionError } = sessionStatsResult;

      if (modelError || sessionError) {
        throw modelError || sessionError;
      }

      const totalModels = modelStats?.length || 0;
      const activeModels = modelStats?.filter(m => m.status === 'active').length || 0;
      const totalSessions = sessionStats?.length || 0;
      
      const now = new Date();
      const upcomingSessions = sessionStats?.filter(s => 
        s.status === 'scheduled' && new Date(s.date) > now
      ).length || 0;

      const ratingsWithValues = sessionStats?.filter(s => s.rating && s.rating > 0) || [];
      const averageRating = ratingsWithValues.length > 0 
        ? ratingsWithValues.reduce((sum, s) => sum + (s.rating || 0), 0) / ratingsWithValues.length 
        : 0;

      return {
        totalModels,
        activeModels,
        totalSessions,
        upcomingSessions,
        averageRating: Math.round(averageRating * 10) / 10
      };
    } catch (error) {
      return {
        totalModels: 0,
        activeModels: 0,
        totalSessions: 0,
        upcomingSessions: 0,
        averageRating: 0
      };
    }
  }, [user?.id]);

  return {
    getModelStatistics
  };
}
