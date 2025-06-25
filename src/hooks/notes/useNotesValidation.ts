
import { useCallback } from 'react';

export function useNotesValidation() {
  const validateNote = useCallback((noteData: {
    title: string;
    content: string;
    category: string;
  }) => {
    const errors: string[] = [];

    if (!noteData.title || noteData.title.trim().length === 0) {
      errors.push('Título é obrigatório');
    }

    if (noteData.title && noteData.title.length > 200) {
      errors.push('Título deve ter no máximo 200 caracteres');
    }

    if (!noteData.content || noteData.content.trim().length === 0) {
      errors.push('Conteúdo é obrigatório');
    }

    if (noteData.content && noteData.content.length > 50000) {
      errors.push('Conteúdo deve ter no máximo 50.000 caracteres');
    }

    if (!noteData.category || noteData.category.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateCategory = useCallback((categoryName: string) => {
    const errors: string[] = [];

    if (!categoryName || categoryName.trim().length === 0) {
      errors.push('Nome da categoria é obrigatório');
    }

    if (categoryName && categoryName.length > 50) {
      errors.push('Nome da categoria deve ter no máximo 50 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    validateNote,
    validateCategory
  };
}
