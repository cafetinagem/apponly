
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Model, PlatformData } from './types';

export function useModelsData(userId: string | undefined) {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const loadingRef = useRef(false);

  const loadModels = useCallback(async () => {
    if (!userId) {
      console.log('📭 [Models] No user ID, clearing models');
      setModels([]);
      setLoading(false);
      return;
    }

    if (loadingRef.current) {
      console.log('📭 [Models] Already loading, skipping');
      return;
    }

    try {
      console.log('📥 [Models] Loading models for user:', userId);
      loadingRef.current = true;
      setLoading(true);

      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
          user_id,
          name,
          artistic_name,
          email,
          phone,
          bio,
          age,
          status,
          platforms,
          city,
          state,
          country,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [Models] Error loading models:', error);
        throw error;
      }

      console.log('✅ [Models] Loaded models:', data?.length || 0);
      
      console.log('✅ [Models] Raw data received:', data?.length || 0);
      
      const typedModels: Model[] = (data || []).map(model => ({
        id: model.id,
        user_id: model.user_id,
        name: model.name,
        artistic_name: model.artistic_name || undefined,
        email: model.email,
        phone: model.phone,
        bio: model.bio || undefined,
        age: model.age || undefined,
        status: model.status as 'active' | 'inactive' | 'pending',
        platforms: Array.isArray(model.platforms) 
          ? (model.platforms as any[]).map(p => ({
              id: p.id || Date.now().toString(),
              type: p.type as 'instagram' | 'telegram' | 'privacy',
              name: p.name || p.type,
              username: p.username || '',
              email: p.email || '',
              password: p.password || '',
              phoneNumber: p.phoneNumber || ''
            }))
          : [],
        portfolio_images: [],
        photos: [],
        city: model.city || undefined,
        state: model.state || undefined,
        country: model.country || undefined,
        gender: undefined,
        birth_date: undefined,
        cpf: undefined,
        rg: undefined,
        height: undefined,
        weight: undefined,
        bust: undefined,
        waist: undefined,
        hips: undefined,
        shoes: undefined,
        hair: undefined,
        eyes: undefined,
        ethnicity: undefined,
        notes: undefined,
        created_at: model.created_at,
        updated_at: model.updated_at
      }));
      
      setModels(typedModels);
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ [Models] Error in loadModels:', error);
      setModels([]);
      setIsInitialized(true);
      toast({
        title: "Erro",
        description: "Erro ao carregar modelos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [userId, toast]);

  // Effect para inicialização automática
  useEffect(() => {
    if (userId && !isInitialized) {
      console.log('🎯 [ModelsData] Auto-loading for user:', userId);
      loadModels();
    } else if (!userId) {
      console.log('📭 [ModelsData] No user, resetting state');
      setModels([]);
      setLoading(false);
      setIsInitialized(false);
    }
  }, [userId, isInitialized]); // Removido loadModels para evitar loop

  return {
    models,
    loading,
    loadModels,
    setModels
  };
}
