
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Model, CreateModelData } from './models/types';

export function useOptimizedModels() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const cacheRef = useRef<{ data: Model[]; timestamp: number } | null>(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const isDataFresh = useCallback(() => {
    if (!cacheRef.current) return false;
    return Date.now() - cacheRef.current.timestamp < CACHE_DURATION;
  }, []);

  const loadModels = useCallback(async (forceRefresh = false) => {
    if (!user?.id) {
      setModels([]);
      setLoading(false);
      return;
    }

    if (!forceRefresh && isDataFresh() && cacheRef.current) {
      console.log('📋 [OptimizedModels] Using cached data');
      setModels(cacheRef.current.data);
      setLoading(false);
      return;
    }

    if (loadingRef.current) return;

    try {
      console.log('📥 [OptimizedModels] Loading models with optimized query');
      loadingRef.current = true;
      setLoading(true);

      // Optimized query with select only needed fields initially
      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Limit initial load

      if (error) {
        console.error('❌ [OptimizedModels] Error loading models:', error);
        throw error;
      }

      const typedModels: Model[] = (data || []).map(model => ({
        id: model.id,
        user_id: user.id,
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
        created_at: model.created_at,
        updated_at: model.updated_at
      } as Model));
      
      setModels(typedModels);
      cacheRef.current = { data: typedModels, timestamp: Date.now() };
      
      console.log('✅ [OptimizedModels] Loaded models:', typedModels.length);
    } catch (error) {
      console.error('❌ [OptimizedModels] Error in loadModels:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar modelos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user?.id, toast, isDataFresh]);

  const createModel = useCallback(async (modelData: CreateModelData) => {
    if (!user?.id) return null;

    try {
      console.log('📤 [OptimizedModels] Creating model');

      const platformsJson = modelData.platforms?.map(p => ({
        id: p.id,
        type: p.type,
        name: p.name,
        username: p.username || '',
        email: p.email || '',
        password: p.password || '',
        phoneNumber: p.phoneNumber || ''
      })) || [];

      const { data, error } = await supabase
        .from('models')
        .insert({
          user_id: user.id,
          name: modelData.name,
          artistic_name: modelData.artistic_name,
          email: modelData.email,
          phone: modelData.phone,
          bio: modelData.bio,
          age: modelData.age,
          status: modelData.status || 'pending',
          platforms: platformsJson,
          city: modelData.city,
          state: modelData.state,
          country: modelData.country
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Modelo criado com sucesso!"
      });
      
      // Invalidate cache and refresh
      cacheRef.current = null;
      await loadModels(true);
      return data;
    } catch (error) {
      console.error('❌ [OptimizedModels] Error creating model:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar modelo",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast, loadModels]);

  const updateModel = useCallback(async (id: string, updates: Partial<CreateModelData>) => {
    if (!user?.id) return null;

    try {
      console.log('📤 [OptimizedModels] Updating model:', id);

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.platforms) {
        updateData.platforms = updates.platforms.map(p => ({
          id: p.id,
          type: p.type,
          name: p.name,
          username: p.username || '',
          email: p.email || '',
          password: p.password || '',
          phoneNumber: p.phoneNumber || ''
        }));
      }

      const { data, error } = await supabase
        .from('models')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso!"
      });
      
      // Invalidate cache and refresh
      cacheRef.current = null;
      await loadModels(true);
      return data;
    } catch (error) {
      console.error('❌ [OptimizedModels] Error updating model:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast, loadModels]);

  const deleteModel = useCallback(async (id: string) => {
    if (!user?.id) return false;

    try {
      console.log('📤 [OptimizedModels] Deleting model:', id);

      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Modelo excluído com sucesso!"
      });
      
      // Invalidate cache and refresh
      cacheRef.current = null;
      await loadModels(true);
      return true;
    } catch (error) {
      console.error('❌ [OptimizedModels] Error deleting model:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir modelo",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadModels]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      loadModels();
    }
  }, [user?.id, loadModels]);

  const refreshModels = useCallback(() => {
    return loadModels(true);
  }, [loadModels]);

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
