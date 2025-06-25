
import { useMemo } from 'react';
import { useNotesCore } from './notes/useNotesCore';
import { useNotesOperations } from './notes/useNotesOperations';
import { useNotesSearch } from './notes/useNotesSearch';
import { useNotesValidation } from './notes/useNotesValidation';

export function useSupabaseNotes() {
  const { notes, loading, refreshNotes } = useNotesCore();
  const { createNote, updateNote, deleteNote } = useNotesOperations();
  const { searchNotes, getNoteStatistics } = useNotesSearch(notes);
  const { validateNote } = useNotesValidation();

  // Memoized return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteStatistics,
    refreshNotes,
    fetchNotes: refreshNotes, // Alias for compatibility
    validateNote
  }), [notes, loading, createNote, updateNote, deleteNote, searchNotes, getNoteStatistics, refreshNotes, validateNote]);

  return returnValue;
}
