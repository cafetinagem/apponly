
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';

export function useNotesOperations() {
  const { user } = useAuth();
  const { deleteFile } = useFileUpload();

  const createNote = useCallback(async (noteData: {
    title: string;
    content: string;
    category: string;
    modelId?: string;
    attachmentUrl?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: noteData.title,
          model_id: noteData.modelId,
          content: noteData.content,
          category: noteData.category,
          attachment_url: noteData.attachmentUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }, [user?.id]);

  const updateNote = useCallback(async (id: string, updates: {
    title?: string;
    content?: string;
    category?: string;
    modelId?: string;
    attachmentUrl?: string;
  }) => {
    if (!user) return null;

    try {
      // Get current note to check if attachment is being changed
      const { data: currentNote } = await supabase
        .from('notes')
        .select('attachment_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      // If attachment is being removed or changed, delete the old file
      if (currentNote?.attachment_url && 
          currentNote.attachment_url !== updates.attachmentUrl) {
        await deleteFile(currentNote.attachment_url);
      }

      const { data, error } = await supabase
        .from('notes')
        .update({
          title: updates.title,
          model_id: updates.modelId,
          content: updates.content,
          category: updates.category,
          attachment_url: updates.attachmentUrl
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }, [user?.id, deleteFile]);

  const deleteNote = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      // First get the note to check for attachments
      const { data: note } = await supabase
        .from('notes')
        .select('attachment_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      // Delete the note from database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // If note had attachment, delete the file from storage
      if (note?.attachment_url) {
        await deleteFile(note.attachment_url);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }, [user?.id, deleteFile]);

  return {
    createNote,
    updateNote,
    deleteNote
  };
}
