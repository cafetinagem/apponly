
import React, { useMemo } from 'react';
import { NoteCard } from './NoteCard';
import { NotesEmptyState } from './NotesEmptyState';
import { Note } from '@/lib/types';

interface VirtualizedNotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleFavorite?: (noteId: string) => Promise<boolean>;
  isFavorite?: (noteId: string) => boolean;
  getModelName: (modelId?: string) => string;
  getCategoryColor: (categoryName: string) => string;
  itemHeight?: number;
  gap?: number;
}

export function VirtualizedNotesList({ 
  notes, 
  onEdit, 
  onDelete,
  onToggleFavorite,
  isFavorite,
  getModelName, 
  getCategoryColor,
  itemHeight = 250,
  gap = 24
}: VirtualizedNotesListProps) {
  const memoizedNotes = useMemo(() => notes, [notes]);

  if (memoizedNotes.length === 0) {
    return <NotesEmptyState />;
  }

  return (
    <div className="space-y-6">
      {memoizedNotes.map((note, index) => (
        <div key={`${note.id}-${index}`} className="animate-fadeIn">
          <NoteCard
            note={note}
            onEdit={() => onEdit(note)}
            onDelete={() => onDelete(note.id)}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
            getModelName={getModelName}
            getCategoryColor={getCategoryColor}
          />
        </div>
      ))}
    </div>
  );
}
