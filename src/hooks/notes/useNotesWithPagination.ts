
import { useState, useMemo, useCallback } from 'react';
import { Note } from '@/lib/types';
import { usePagination } from '@/hooks/usePagination';

interface NotesWithPaginationOptions {
  pageSize?: number;
  searchTerm?: string;
  categoryFilter?: string;
  modelFilter?: string;
}

export function useNotesWithPagination(
  notes: Note[], 
  options: NotesWithPaginationOptions = {}
) {
  const { 
    pageSize = 12, 
    searchTerm = '', 
    categoryFilter = 'all', 
    modelFilter = 'all' 
  } = options;

  // Filtrar notas com memoização para performance
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.category.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(note => note.category === categoryFilter);
    }

    if (modelFilter !== 'all' && modelFilter !== 'general') {
      filtered = filtered.filter(note => note.modelId === modelFilter);
    } else if (modelFilter === 'general') {
      filtered = filtered.filter(note => !note.modelId);
    }

    return filtered;
  }, [notes, searchTerm, categoryFilter, modelFilter]);

  // Hook de paginação
  const pagination = usePagination(filteredNotes, { pageSize });

  // Estatísticas úteis
  const stats = useMemo(() => ({
    total: filteredNotes.length,
    filtered: filteredNotes.length !== notes.length,
    currentPageCount: pagination.data.length
  }), [filteredNotes.length, notes.length, pagination.data.length]);

  return {
    notes: pagination.data,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
      goToPage: pagination.goToPage,
      nextPage: pagination.nextPage,
      previousPage: pagination.previousPage
    },
    stats,
    filteredNotesCount: filteredNotes.length,
    totalNotesCount: notes.length
  };
}
