
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useNoteTagRelations() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getNoteTags = useCallback(async (noteId: string) => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('note_tag_relations')
        .select(`
          tag_id,
          note_tags (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .eq('note_id', noteId);

      if (error) throw error;

      return (data || []).map(relation => ({
        id: relation.note_tags?.id || '',
        name: relation.note_tags?.name || '',
        color: relation.note_tags?.color || '#6B7280'
      }));
    } catch (error) {
      console.error('Erro ao carregar tags da nota:', error);
      return [];
    }
  }, [user?.id]);

  const addTagToNote = useCallback(async (noteId: string, tagId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('note_tag_relations')
        .insert({
          user_id: user.id,
          note_id: noteId,
          tag_id: tagId
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tag adicionada à nota!"
      });

      return true;
    } catch (error) {
      console.error('Erro ao adicionar tag à nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tag",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  const removeTagFromNote = useCallback(async (noteId: string, tagId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('note_tag_relations')
        .delete()
        .eq('user_id', user.id)
        .eq('note_id', noteId)
        .eq('tag_id', tagId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tag removida da nota!"
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover tag da nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a tag",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  const setNoteTags = useCallback(async (noteId: string, tagIds: string[]) => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      // Primeiro, remover todas as tags existentes da nota
      await supabase
        .from('note_tag_relations')
        .delete()
        .eq('user_id', user.id)
        .eq('note_id', noteId);

      // Depois, adicionar as novas tags
      if (tagIds.length > 0) {
        const relations = tagIds.map(tagId => ({
          user_id: user.id,
          note_id: noteId,
          tag_id: tagId
        }));

        const { error } = await supabase
          .from('note_tag_relations')
          .insert(relations);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao definir tags da nota:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as tags",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const getNotesWithTags = useCallback(async () => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          note_tag_relations (
            tag_id,
            note_tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(note => ({
        ...note,
        tags: (note.note_tag_relations || []).map((relation: any) => ({
          id: relation.note_tags?.id || '',
          name: relation.note_tags?.name || '',
          color: relation.note_tags?.color || '#6B7280'
        }))
      }));
    } catch (error) {
      console.error('Erro ao carregar notas com tags:', error);
      return [];
    }
  }, [user?.id]);

  return {
    loading,
    getNoteTags,
    addTagToNote,
    removeTagFromNote,
    setNoteTags,
    getNotesWithTags
  };
}
