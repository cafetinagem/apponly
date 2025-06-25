
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ChecklistItem } from '@/lib/types';

interface TaskChecklistSectionProps {
  checklist: ChecklistItem[];
  setChecklist: (checklist: ChecklistItem[]) => void;
  newChecklistItem: string;
  setNewChecklistItem: (item: string) => void;
}

export function TaskChecklistSection({
  checklist,
  setChecklist,
  newChecklistItem,
  setNewChecklistItem
}: TaskChecklistSectionProps) {
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false
      };
      setChecklist([...checklist, newItem]);
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (itemId: string) => {
    setChecklist(checklist.filter(item => item.id !== itemId));
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Checklist</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            placeholder="Adicionar item ao checklist..."
            onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
          />
          <Button
            type="button"
            size="sm"
            onClick={addChecklistItem}
            disabled={!newChecklistItem.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {checklist.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Nenhum item no checklist</p>
            <p className="text-sm">Adicione itens para organizar sua tarefa</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="rounded"
                />
                <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                  {item.text}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeChecklistItem(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
