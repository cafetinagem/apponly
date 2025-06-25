
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NoteTag {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt: Date;
}

export function useNoteTags() {
  const [tags, setTags] = useState<NoteTag[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadTags = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('note_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      // Simular contagem de notas por tag (seria uma query real)
      const tagsWithCount = (data || []).map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        count: 0, // TODO: implementar contagem real
        createdAt: new Date(tag.created_at)
      }));

      setTags(tagsWithCount);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const createTag = useCallback(async (name: string, color: string = '#6B7280') => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('note_tags')
        .insert({
          user_id: user.id,
          name: name.trim(),
          color
        })
        .select()
        .single();

      if (error) throw error;

      const newTag: NoteTag = {
        id: data.id,
        name: data.name,
        color: data.color,
        count: 0,
        createdAt: new Date(data.created_at)
      };

      setTags(prev => [...prev, newTag]);
      
      toast({
        title: "Sucesso",
        description: "Tag criada com sucesso!"
      });

      return newTag;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tag",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast]);

  const deleteTag = useCallback(async (tagId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('note_tags')
        .delete()
        .eq('id', tagId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Sucesso",
        description: "Tag removida com sucesso!"
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar tag:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a tag",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags,
    loading,
    createTag,
    deleteTag,
    refreshTags: loadTags
  };
}
