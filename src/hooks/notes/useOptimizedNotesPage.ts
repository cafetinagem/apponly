
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNotesCore } from './useNotesCore';
import { useNotesOperations } from './useNotesOperations';
import { useNoteFavorites } from './useNoteFavorites';
import { useNoteCategories } from '@/hooks/useNoteCategories';
import { useModels } from '@/hooks/useModels';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/lib/types';

interface AdvancedFilters {
  sortBy: 'created_at' | 'updated_at' | 'title' | 'category';
  sortOrder: 'asc' | 'desc';
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export function useOptimizedNotesPage() {
  const { toast } = useToast();
  const { notes, loading, refreshNotes } = useNotesCore();
  const { createNote, updateNote, deleteNote } = useNotesOperations();
  const { toggleFavorite, isFavorite } = useNoteFavorites();
  const { categories } = useNoteCategories();
  const { models } = useModels();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirmNote, setDeleteConfirmNote] = useState<Note | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = [...notes];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(note => note.category === categoryFilter);
    }

    // Apply model filter
    if (modelFilter) {
      filtered = filtered.filter(note => note.modelId === modelFilter);
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(note => isFavorite(note.id));
    }

    // Apply date range filter
    if (advancedFilters.dateRange?.from || advancedFilters.dateRange?.to) {
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.createdAt);
        const from = advancedFilters.dateRange?.from;
        const to = advancedFilters.dateRange?.to;
        
        if (from && noteDate < from) return false;
        if (to && noteDate > to) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (advancedFilters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'updated_at':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'created_at':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (aValue < bValue) return advancedFilters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return advancedFilters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [notes, searchTerm, categoryFilter, modelFilter, showFavoritesOnly, advancedFilters, isFavorite]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedNotes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNotes = filteredAndSortedNotes.slice(startIndex, startIndex + pageSize);

  const pagination: PaginationState = {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
    previousPage: () => setCurrentPage(prev => Math.max(prev - 1, 1))
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, modelFilter, showFavoritesOnly, advancedFilters]);

  // Create note handler
  const handleCreateNote = useCallback(async (noteData: {
    title: string;
    content: string;
    category: string;
    modelId?: string;
    attachmentUrl?: string;
  }) => {
    try {
      await createNote(noteData);
      setIsCreateModalOpen(false);
      toast({
        title: "Nota criada com sucesso!",
        description: "Sua nova nota foi salva."
      });
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      toast({
        title: "Erro ao criar nota",
        description: "Houve um problema ao salvar a nota.",
        variant: "destructive"
      });
    }
  }, [createNote, toast]);

  // Update note handler
  const handleUpdateNote = useCallback(async (noteData: {
    title: string;
    content: string;
    category: string;
    modelId?: string;
    attachmentUrl?: string;
  }) => {
    if (!editingNote) return;

    try {
      await updateNote(editingNote.id, noteData);
      setEditingNote(null);
      toast({
        title: "Nota atualizada com sucesso!",
        description: "As alterações foram salvas."
      });
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      toast({
        title: "Erro ao atualizar nota",
        description: "Houve um problema ao salvar as alterações.",
        variant: "destructive"
      });
    }
  }, [editingNote, updateNote, toast]);

  // Delete note handler
  const handleDeleteNote = useCallback(async (note: Note) => {
    try {
      await deleteNote(note.id);
      setDeleteConfirmNote(null);
      toast({
        title: "Nota excluída com sucesso!",
        description: "A nota foi removida permanentemente."
      });
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: "Erro ao excluir nota",
        description: "Houve um problema ao excluir a nota.",
        variant: "destructive"
      });
    }
  }, [deleteNote, toast]);

  // Helper functions
  const getModelName = useCallback((modelId?: string) => {
    if (!modelId) return 'Geral';
    const model = models.find(m => m.id === modelId);
    return model?.name || model?.artistic_name || 'Modelo';
  }, [models]);

  const getCategoryColor = useCallback((categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#F97316';
  }, [categories]);

  // Statistics
  const stats = useMemo(() => ({
    total: notes.length,
    filtered: filteredAndSortedNotes.length,
    currentPageCount: paginatedNotes.length,
    favorites: notes.filter(note => isFavorite(note.id)).length,
    categories: [...new Set(notes.map(note => note.category))].length
  }), [notes, filteredAndSortedNotes, paginatedNotes, isFavorite]);

  return {
    // Core data
    notes: paginatedNotes,
    loading,
    
    // Filters
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    modelFilter,
    setModelFilter,
    showFavoritesOnly,
    setShowFavoritesOnly,
    advancedFilters,
    setAdvancedFilters,
    
    // Modals
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingNote,
    setEditingNote,
    deleteConfirmNote,
    setDeleteConfirmNote,
    
    // Operations
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    toggleFavorite,
    isFavorite,
    
    // Pagination
    pagination,
    
    // Helper data
    categories,
    models,
    tags: [], // TODO: Implement tags
    stats,
    filteredNotesCount: filteredAndSortedNotes.length,
    
    // Helper functions
    getModelName,
    getCategoryColor,
    createTag: async (name: string) => name, // TODO: Implement
    
    // Sorting (legacy support)
    sortBy: advancedFilters.sortBy,
    setSortBy: (sortBy: 'created_at' | 'updated_at' | 'title' | 'category') => 
      setAdvancedFilters(prev => ({ ...prev, sortBy })),
    sortOrder: advancedFilters.sortOrder,
    setSortOrder: (sortOrder: 'asc' | 'desc') => 
      setAdvancedFilters(prev => ({ ...prev, sortOrder }))
  };
}
