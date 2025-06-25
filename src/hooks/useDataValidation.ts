
import { Task, ChecklistItem } from '@/lib/types';

export function useDataValidation() {
  const validateTask = (task: Partial<Task>): boolean => {
    if (!task.title || task.title.trim().length === 0) {
      return false;
    }
    if (!task.description || task.description.trim().length === 0) {
      return false;
    }
    return true;
  };

  const validateChecklist = (checklist: ChecklistItem[]): boolean => {
    if (!Array.isArray(checklist)) {
      return false;
    }
    
    return checklist.every(item => 
      item.id && 
      typeof item.text === 'string' && 
      item.text.trim().length > 0 &&
      typeof item.completed === 'boolean'
    );
  };

  return {
    validateTask,
    validateChecklist
  };
}
