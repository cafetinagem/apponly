
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { registerRealtimeListener } from '@/lib/realtimeManager';

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export function useNoteCategories() {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('📂 [NoteCategories] Carregando categorias para usuário:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('note_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('❌ [NoteCategories] Erro ao carregar:', error);
        setCategories([]);
      } else {
        console.log('✅ [NoteCategories] Categorias carregadas:', data?.length || 0);
        setCategories(data || []);
      }
    } catch (error) {
      console.error('❌ [NoteCategories] Erro inesperado:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createCategory = useCallback(async (name: string, color: string = '#F97316') => {
    if (!user) return null;

    console.log('➕ [NoteCategories] Criando categoria:', { name, color });

    try {
      const { data, error } = await supabase
        .from('note_categories')
        .insert({
          name: name.trim(),
          color,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [NoteCategories] Erro ao criar:', error);
        throw error;
      }

      console.log('✅ [NoteCategories] Categoria criada:', data);
      await loadCategories();
      return data;
    } catch (error) {
      console.error('❌ [NoteCategories] Erro na criação:', error);
      throw error;
    }
  }, [user?.id, loadCategories]);

  const updateCategory = useCallback(async (categoryId: string, updates: { name?: string; color?: string }) => {
    if (!user) return null;

    console.log('✏️ [NoteCategories] Atualizando categoria:', categoryId, updates);

    try {
      const { data, error } = await supabase
        .from('note_categories')
        .update(updates)
        .eq('id', categoryId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ [NoteCategories] Erro ao atualizar:', error);
        throw error;
      }

      console.log('✅ [NoteCategories] Categoria atualizada:', data);
      await loadCategories();
      return data;
    } catch (error) {
      console.error('❌ [NoteCategories] Erro na atualização:', error);
      throw error;
    }
  }, [user?.id, loadCategories]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!user) return false;

    console.log('🗑️ [NoteCategories] Excluindo categoria:', categoryId);

    try {
      const { error } = await supabase
        .from('note_categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [NoteCategories] Erro ao excluir:', error);
        throw error;
      }

      console.log('✅ [NoteCategories] Categoria excluída');
      await loadCategories();
      return true;
    } catch (error) {
      console.error('❌ [NoteCategories] Erro na exclusão:', error);
      throw error;
    }
  }, [user?.id, loadCategories]);

  // Load categories when user changes
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Setup realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔌 [NoteCategories] Configurando listener realtime');
    
    const handleRealtimeUpdate = (payload: any) => {
      console.log('📨 [NoteCategories] Update realtime:', payload);
      
      // Only reload if it's for the current user
      const updatedUserId = payload.new?.user_id || payload.old?.user_id;
      if (updatedUserId === user.id) {
        console.log('✅ [NoteCategories] Recarregando categorias após update');
        loadCategories();
      }
    };

    // Subscribe using the new realtime manager
    const unsubscribe = registerRealtimeListener('note_categories', handleRealtimeUpdate);

    return () => {
      console.log('🧹 [NoteCategories] Limpando subscription realtime');
      unsubscribe();
    };
  }, [user?.id, loadCategories]);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
}
