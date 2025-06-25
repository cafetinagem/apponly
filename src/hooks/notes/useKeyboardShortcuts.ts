
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewNote: () => void;
  onSearch: () => void;
  onToggleSort: () => void;
  onRefresh: () => void;
  onEscape: () => void;
}

export function useKeyboardShortcuts({
  onNewNote,
  onSearch,
  onToggleSort,
  onRefresh,
  onEscape
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N: Nova nota
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        onNewNote();
      }

      // Ctrl/Cmd + K: Focar busca
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearch();
      }

      // Ctrl/Cmd + S: Alternar ordenação
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onToggleSort();
      }

      // F5: Atualizar
      if (event.key === 'F5') {
        event.preventDefault();
        onRefresh();
      }

      // Escape: Fechar modais
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onNewNote, onSearch, onToggleSort, onRefresh, onEscape]);
}
