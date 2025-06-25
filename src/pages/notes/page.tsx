
'use client';

import { useState } from 'react';
import { useOptimizedNotesPage } from '@/hooks/notes/useOptimizedNotesPage';
import { useNoteTags } from '@/hooks/notes/useNoteTags';
import { useKeyboardShortcuts } from '@/hooks/notes/useKeyboardShortcuts';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NotesFilters } from '@/components/notes/NotesFilters';
import { VirtualizedNotesList } from '@/components/notes/VirtualizedNotesList';
import { NoteModal } from '@/components/notes/NoteModal';
import { NotesSkeletonLoader } from '@/components/notes/NotesSkeletonLoader';
import { NotesPerformanceStats } from '@/components/notes/NotesPerformanceStats';
import { NotesSortControls } from '@/components/notes/NotesSortControls';
import { NotesProgressIndicator } from '@/components/notes/NotesProgressIndicator';
import { PaginationControls } from '@/components/PaginationControls';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const NotesPageContent = () => {
  const {
    loading,
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    notes,
    categories,
    models,
    tags,
    pagination,
    stats,
    filteredNotesCount,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingNote,
    setEditingNote,
    deleteConfirmNote,
    setDeleteConfirmNote,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    toggleFavorite,
    isFavorite,
    createTag,
    getModelName,
    getCategoryColor
  } = useOptimizedNotesPage();

  const { tags: availableTags, createTag: createTagHook } = useNoteTags();

  // Estado para operações em progresso
  const [progressOperations, setProgressOperations] = useState<Array<{
    id: string;
    type: 'create' | 'update' | 'delete' | 'upload';
    status: 'pending' | 'processing' | 'completed' | 'error';
    message?: string;
    progress?: number;
  }>>([]);

  // Função para focar no campo de busca
  const focusSearch = () => {
    const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
    searchInput?.focus();
  };

  // Alternar ordenação
  const toggleSort = () => {
    setAdvancedFilters({
      ...advancedFilters,
      sortOrder: advancedFilters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  // Fechar modais
  const handleEscape = () => {
    if (isCreateModalOpen) setIsCreateModalOpen(false);
    if (editingNote) setEditingNote(null);
    if (deleteConfirmNote) setDeleteConfirmNote(null);
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onNewNote: () => setIsCreateModalOpen(true),
    onSearch: focusSearch,
    onToggleSort: toggleSort,
    onRefresh: () => window.location.reload(),
    onEscape: handleEscape
  });

  const handleOperationComplete = (operationId: string) => {
    setProgressOperations(prev => 
      prev.filter(op => op.id !== operationId)
    );
  };

  // Fix the function signatures for VirtualizedNotesList
  const handleEditNote = (note: any) => {
    setEditingNote(note);
  };

  const handleDeleteConfirm = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setDeleteConfirmNote(note);
    }
  };

  const handleToggleFavoriteAsync = async (noteId: string): Promise<boolean> => {
    try {
      const result = await toggleFavorite(noteId);
      return result;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <ConnectionStatus />
        <NotesHeader onCreateNote={() => setIsCreateModalOpen(true)} />
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <NotesSkeletonLoader count={4} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      <ConnectionStatus />
      <NotesHeader onCreateNote={() => setIsCreateModalOpen(true)} />

      <div className="space-y-6">
        <NotesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          modelFilter={modelFilter}
          setModelFilter={setModelFilter}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          advancedFilters={advancedFilters}
          setAdvancedFilters={setAdvancedFilters}
          categories={categories}
          models={models}
          tags={tags}
          useAdvancedSearch={true}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <NotesSortControls
            sortBy={advancedFilters.sortBy}
            setSortBy={(sortBy: 'created_at' | 'updated_at' | 'title' | 'category') => setAdvancedFilters({ ...advancedFilters, sortBy })}
            sortOrder={advancedFilters.sortOrder}
            setSortOrder={(sortOrder: 'asc' | 'desc') => setAdvancedFilters({ ...advancedFilters, sortOrder })}
          />
        </div>

        <NotesPerformanceStats
          totalNotes={stats.total}
          filteredNotes={filteredNotesCount}
          currentPageNotes={stats.currentPageCount}
        />
      </div>

      <div className="w-full">
        <VirtualizedNotesList
          notes={notes}
          onEdit={handleEditNote}
          onDelete={handleDeleteConfirm}
          onToggleFavorite={handleToggleFavoriteAsync}
          isFavorite={isFavorite}
          getModelName={getModelName}
          getCategoryColor={getCategoryColor}
        />
      </div>

      {notes.length > 0 && (
        <div className="w-full">
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filteredNotesCount}
            pageSize={12}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={pagination.goToPage}
            onNextPage={pagination.nextPage}
            onPreviousPage={pagination.previousPage}
          />
        </div>
      )}

      <NoteModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateNote}
        availableTags={availableTags}
        onCreateTag={createTagHook}
      />

      <NoteModal
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleUpdateNote}
        note={editingNote}
        isEditing={true}
        availableTags={availableTags}
        onCreateTag={createTagHook}
      />

      <AlertDialog open={!!deleteConfirmNote} onOpenChange={() => setDeleteConfirmNote(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel 
              onClick={() => setDeleteConfirmNote(null)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmNote && handleDeleteNote(deleteConfirmNote)}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NotesProgressIndicator 
        operations={progressOperations}
        onComplete={handleOperationComplete}
      />
    </div>
  );
};

const NotesPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <NotesPageContent />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NotesPage;
