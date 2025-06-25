
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { Task, ChecklistItem } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';

interface TaskChecklistProps {
  task: Task;
  editable?: boolean;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ task, editable = false }) => {
  const { updateTask } = useTasks();
  const [newItem, setNewItem] = React.useState('');

  const toggleChecklistItem = async (itemId: string) => {
    const updatedChecklist = task.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    await updateTask({ id: task.id, updates: { checklist: updatedChecklist } });
  };

  const addChecklistItem = async () => {
    if (!newItem.trim()) return;
    
    const newChecklistItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItem.trim(),
      completed: false
    };
    
    const updatedChecklist = [...task.checklist, newChecklistItem];
    await updateTask({ id: task.id, updates: { checklist: updatedChecklist } });
    setNewItem('');
  };

  const removeChecklistItem = async (itemId: string) => {
    const updatedChecklist = task.checklist.filter(item => item.id !== itemId);
    await updateTask({ id: task.id, updates: { checklist: updatedChecklist } });
  };

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;

  if (task.checklist.length === 0 && !editable) {
    return null;
  }

  return (
    <div className="space-y-3">
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Checklist</span>
          <span className="text-xs text-gray-500">
            {completedItems}/{totalItems} concluídos
          </span>
        </div>
      )}

      {totalItems > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        {task.checklist.map(item => (
          <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleChecklistItem(item.id)}
            />
            <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
              {item.text}
            </span>
            {editable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeChecklistItem(item.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Adicionar item..."
            onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={addChecklistItem}
            disabled={!newItem.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
