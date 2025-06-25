
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NoteModalForm } from './NoteModalForm';
import { useNoteCategories } from '@/hooks/useNoteCategories';
import { useSupabaseModels } from '@/hooks/useSupabaseModels';
import { Note } from '@/lib/types';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    category: string;
    modelId?: string;
    attachmentUrl?: string;
    tags?: string[];
  }) => void;
  note?: Note | null;
  isEditing?: boolean;
  availableTags?: Array<{ id: string; name: string; color: string }>;
  onCreateTag?: (name: string, color?: string) => Promise<any>;
}

export function NoteModal({
  open,
  onClose,
  onSave,
  note,
  isEditing = false,
  availableTags = [],
  onCreateTag
}: NoteModalProps) {
  const { categories, createCategory, updateCategory, deleteCategory } = useNoteCategories();
  const { models } = useSupabaseModels();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    modelId: '',
    attachmentUrl: ''
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar formulário quando nota muda
  useEffect(() => {
    if (note && isEditing) {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        modelId: note.modelId || '',
        attachmentUrl: note.attachmentUrl || ''
      });
      setSelectedTags([]); // TODO: carregar tags da nota
    } else {
      setFormData({
        title: '',
        content: '',
        category: categories[0]?.name || '',
        modelId: '',
        attachmentUrl: ''
      });
      setSelectedTags([]);
    }
  }, [note, isEditing, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        tags: selectedTags
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Nota' : 'Nova Nota'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NoteModalForm
            formData={formData}
            setFormData={setFormData}
            models={models}
            categories={categories}
            onCreateCategory={createCategory}
            onDeleteCategory={deleteCategory}
            onUpdateCategory={updateCategory}
            isEditing={isEditing}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={availableTags}
            onCreateTag={onCreateTag}
          />

          <div className="flex gap-3 pt-6 border-t">
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Nota' : 'Criar Nota')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
