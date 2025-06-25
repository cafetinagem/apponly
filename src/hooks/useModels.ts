
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useModelsData } from './models/useModelsData';
import { useModelsOperations } from './models/useModelsOperations';
import { useModelsRealtime } from './models/useModelsRealtime';

export function useModels() {
  const { user } = useAuth();
  const userId = user?.id;

  const { models, loading, loadModels } = useModelsData(userId);
  
  // Estabilizar refreshModels para evitar re-renders
  const refreshModels = useCallback(async () => {
    console.log('🔄 [useModels] Refresh models called');
    if (userId) {
      return loadModels();
    }
  }, [userId, loadModels]);

  const { createModel, updateModel, deleteModel } = useModelsOperations(userId, refreshModels);

  useModelsRealtime(userId, refreshModels);

  // O carregamento inicial agora é feito pelo useModelsData

  const getModelStatistics = useCallback(() => {
    const totalModels = models.length;
    const activeModels = models.filter(m => m.status === 'active').length;
    
    return {
      totalModels,
      activeModels,
      totalSessions: 0,
      upcomingSessions: 0,
      averageRating: 0
    };
  }, [models]);

  return {
    models,
    loading,
    createModel,
    updateModel,
    deleteModel,
    refreshModels,
    getModelStatistics
  };
}
