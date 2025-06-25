
import { useCallback, useMemo } from 'react';
import { Note } from '@/lib/types';

export function useNotesSearch(notes: Note[]) {
  const searchNotes = useCallback((searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      note.category.toLowerCase().includes(term)
    );
  }, [notes]);

  const getNoteStatistics = useCallback(() => {
    const categories = [...new Set(notes.map(note => note.category))];
    const totalAttachments = notes.reduce((acc, note) => acc + (note.attachments?.length || 0), 0);
    const todayNotes = notes.filter(note => 
      new Date(note.createdAt).toDateString() === new Date().toDateString()
    ).length;

    return {
      totalNotes: notes.length,
      totalCategories: categories.length,
      totalAttachments,
      todayNotes
    };
  }, [notes]);

  return {
    searchNotes,
    getNoteStatistics
  };
}
