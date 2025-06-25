
import { useState, useEffect, useCallback } from 'react';
import { useModels } from '@/hooks/useModels';

export function useSupabaseModels() {
  const { models, loading, refreshModels } = useModels();

  return {
    models: models || [],
    loading,
    refreshModels
  };
}
