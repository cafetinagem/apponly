
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { registerRealtimeListener } from '@/lib/realtimeManager';

export function useNoteFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('❤️ [NoteFavorites] Carregando favoritos para usuário:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('note_favorites')
        .select('note_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [NoteFavorites] Erro ao carregar:', error);
        setFavorites([]);
      } else {
        const favoriteIds = (data || []).map(fav => fav.note_id);
        console.log('✅ [NoteFavorites] Favoritos carregados:', favoriteIds.length);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('❌ [NoteFavorites] Erro inesperado:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const toggleFavorite = useCallback(async (noteId: string) => {
    if (!user) return false;

    const isFavorite = favorites.includes(noteId);
    console.log('❤️ [NoteFavorites] Toggle favorito:', noteId, 'atual:', isFavorite);

    try {
      if (isFavorite) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('note_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', noteId);

        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== noteId));
        console.log('✅ [NoteFavorites] Removido dos favoritos');
        return false;
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('note_favorites')
          .insert({
            user_id: user.id,
            note_id: noteId
          });

        if (error) throw error;
        
        setFavorites(prev => [...prev, noteId]);
        console.log('✅ [NoteFavorites] Adicionado aos favoritos');
        return true;
      }
    } catch (error) {
      console.error('❌ [NoteFavorites] Erro ao toggle favorito:', error);
      return isFavorite; // Manter estado atual
    }
  }, [user?.id, favorites]);

  const isFavorite = useCallback((noteId: string) => {
    return favorites.includes(noteId);
  }, [favorites]);

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Setup realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔌 [NoteFavorites] Configurando listener realtime');
    
    const handleRealtimeUpdate = (payload: any) => {
      console.log('📨 [NoteFavorites] Update realtime:', payload);
      
      // Only reload if it's for the current user
      const updatedUserId = payload.new?.user_id || payload.old?.user_id;
      if (updatedUserId === user.id) {
        console.log('✅ [NoteFavorites] Recarregando favoritos após update');
        loadFavorites();
      }
    };

    // Subscribe using the new realtime manager
    const unsubscribe = registerRealtimeListener('note_favorites', handleRealtimeUpdate);

    return () => {
      console.log('🧹 [NoteFavorites] Limpando subscription realtime');
      unsubscribe();
    };
  }, [user?.id, loadFavorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites
  };
}
