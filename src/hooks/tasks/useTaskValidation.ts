
import { Task, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useTaskValidation() {
  const { toast } = useToast();

  const validateTask = (task: Partial<Task>): boolean => {
    if (!task.title?.trim()) {
      toast({
        title: "Erro de validação",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive"
      });
      return false;
    }

    if (task.title.length > 200) {
      toast({
        title: "Erro de validação",
        description: "O título deve ter no máximo 200 caracteres.",
        variant: "destructive"
      });
      return false;
    }

    if (task.description && task.description.length > 1000) {
      toast({
        title: "Erro de validação",
        description: "A descrição deve ter no máximo 1000 caracteres.",
        variant: "destructive"
      });
      return false;
    }

    if (task.timeEstimate && task.timeEstimate <= 0) {
      toast({
        title: "Erro de validação",
        description: "A estimativa de tempo deve ser maior que zero.",
        variant: "destructive"
      });
      return false;
    }

    if (task.deadline && task.deadline < new Date()) {
      toast({
        title: "Aviso",
        description: "O prazo definido já passou.",
        variant: "destructive"
      });
    }

    return true;
  };

  const validateChecklist = (checklist: ChecklistItem[]): boolean => {
    const duplicateTexts = checklist.filter((item, index, arr) => 
      arr.findIndex(i => i.text.trim().toLowerCase() === item.text.trim().toLowerCase()) !== index
    );

    if (duplicateTexts.length > 0) {
      toast({
        title: "Erro de validação",
        description: "Existem itens duplicados na checklist.",
        variant: "destructive"
      });
      return false;
    }

    const emptyItems = checklist.filter(item => !item.text.trim());
    if (emptyItems.length > 0) {
      toast({
        title: "Erro de validação",
        description: "Todos os itens da checklist devem ter texto.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return {
    validateTask,
    validateChecklist
  };
}
