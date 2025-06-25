
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Model, ModelKPIs } from './types';

export function useModelStatistics(models: Model[]) {
  const { user } = useAuth();

  const getModelStatistics = useCallback(async (): Promise<ModelKPIs> => {
    const totalModels = models.length;
    const activeModels = models.filter(m => m.status === 'active').length;
    
    try {
      const { data: sessions } = await supabase
        .from('model_sessions')
        .select('*')
        .eq('user_id', user?.id);
      
      const totalSessions = sessions?.length || 0;
      const upcomingSessions = sessions?.filter(s => s.status === 'scheduled').length || 0;

      return {
        totalModels,
        activeModels,
        totalSessions,
        upcomingSessions,
        averageRating: 4.8
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalModels,
        activeModels,
        totalSessions: 0,
        upcomingSessions: 0,
        averageRating: 0
      };
    }
  }, [models, user]);

  return {
    getModelStatistics
  };
}
