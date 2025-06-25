
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Note, NoteAttachment } from '@/lib/types';
import { registerRealtimeListener } from '@/lib/realtimeManager';

export function useNotesCore() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: Note[] = (data || []).map(note => ({
        id: note.id,
        title: note.title,
        modelId: note.model_id,
        content: note.content,
        category: note.category,
        attachments: Array.isArray(note.attachments) ? (note.attachments as unknown as NoteAttachment[]) : [],
        attachmentUrl: note.attachment_url,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at)
      }));
      setNotes(formattedNotes);
    } catch (error) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Memoized realtime handler
  const handleRealtimeUpdate = useCallback((payload: any) => {
    loadNotes();
  }, [loadNotes]);

  // Setup realtime listener
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = registerRealtimeListener('notes', handleRealtimeUpdate);
    return unsubscribe;
  }, [user?.id, handleRealtimeUpdate]);

  // Initial load
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    refreshNotes: loadNotes
  };
}
