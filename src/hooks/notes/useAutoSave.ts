
import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  onSave: (data: any) => Promise<void>;
  data: any;
  delay?: number;
  enabled?: boolean;
  isEditing?: boolean;
}

export function useAutoSave({ 
  onSave, 
  data, 
  delay = 2000, 
  enabled = true,
  isEditing = false 
}: AutoSaveOptions) {
  const { toast } = useToast();
  const lastSavedData = useRef<any>(null);
  const isSaving = useRef(false);
  const debouncedData = useDebounce(data, delay);

  const performSave = useCallback(async (dataToSave: any) => {
    if (isSaving.current || !enabled || !isEditing) return;

    // Verificar se há mudanças reais
    if (JSON.stringify(dataToSave) === JSON.stringify(lastSavedData.current)) {
      return;
    }

    // Validar dados antes de salvar
    if (!dataToSave.title?.trim() || !dataToSave.content?.trim()) {
      return;
    }

    isSaving.current = true;
    
    try {
      await onSave(dataToSave);
      lastSavedData.current = dataToSave;
      
      toast({
        title: "💾 Auto-save",
        description: "Alterações salvas automaticamente",
        duration: 1500
      });
    } catch (error) {
      console.error('Erro no auto-save:', error);
      toast({
        title: "⚠️ Erro no auto-save",
        description: "Falha ao salvar automaticamente. Salve manualmente.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      isSaving.current = false;
    }
  }, [onSave, enabled, isEditing, toast]);

  useEffect(() => {
    if (debouncedData && enabled && isEditing) {
      performSave(debouncedData);
    }
  }, [debouncedData, enabled, isEditing, performSave]);

  return {
    isSaving: isSaving.current,
    lastSaved: lastSavedData.current
  };
}
