
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateModelData } from './types';

export function useModelsOperations(userId: string | undefined, refreshModels: () => Promise<void>) {
  const { toast } = useToast();

  const createModel = useCallback(async (modelData: CreateModelData) => {
    if (!userId) {
      console.log('❌ [Models] No user ID for create');
      return null;
    }

    try {
      console.log('📤 [Models] Creating model:', modelData.name);

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
          user_id: userId,
          name: modelData.name,
          artistic_name: modelData.artistic_name,
          email: modelData.email,
          phone: modelData.phone,
          bio: modelData.bio,
          age: modelData.age,
          status: modelData.status || 'pending',
          platforms: platformsJson,
          portfolio_images: modelData.portfolio_images || [],
          photos: modelData.photos || [],
          city: modelData.city,
          state: modelData.state,
          country: modelData.country,
          gender: modelData.gender,
          birth_date: modelData.birth_date,
          cpf: modelData.cpf,
          rg: modelData.rg,
          height: modelData.height,
          weight: modelData.weight,
          bust: modelData.bust,
          waist: modelData.waist,
          hips: modelData.hips,
          shoes: modelData.shoes,
          hair: modelData.hair,
          eyes: modelData.eyes,
          ethnicity: modelData.ethnicity,
          notes: modelData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [Models] Error creating model:', error);
        throw error;
      }

      console.log('✅ [Models] Model created:', data.id);
      toast({
        title: "Sucesso",
        description: "Modelo criado com sucesso!"
      });
      
      await refreshModels();
      return data;
    } catch (error) {
      console.error('❌ [Models] Error in createModel:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar modelo",
        variant: "destructive"
      });
      return null;
    }
  }, [userId, toast, refreshModels]);

  const updateModel = useCallback(async (id: string, updates: Partial<CreateModelData>) => {
    if (!userId) {
      console.log('❌ [Models] No user ID for update');
      return null;
    }

    try {
      console.log('📤 [Models] Updating model:', id);

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
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ [Models] Error updating model:', error);
        throw error;
      }

      console.log('✅ [Models] Model updated:', data.id);
      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso!"
      });
      
      await refreshModels();
      return data;
    } catch (error) {
      console.error('❌ [Models] Error in updateModel:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo",
        variant: "destructive"
      });
      return null;
    }
  }, [userId, toast, refreshModels]);

  const deleteModel = useCallback(async (id: string) => {
    if (!userId) {
      console.log('❌ [Models] No user ID for delete');
      return false;
    }

    try {
      console.log('📤 [Models] Deleting model:', id);

      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [Models] Error deleting model:', error);
        throw error;
      }

      console.log('✅ [Models] Model deleted:', id);
      toast({
        title: "Sucesso",
        description: "Modelo excluído com sucesso!"
      });
      
      await refreshModels();
      return true;
    } catch (error) {
      console.error('❌ [Models] Error in deleteModel:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir modelo",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, toast, refreshModels]);

  return {
    createModel,
    updateModel,
    deleteModel
  };
}
