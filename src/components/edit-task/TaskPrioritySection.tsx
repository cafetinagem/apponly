
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskPrioritySectionProps {
  priority: 'baixa' | 'media' | 'alta';
  setPriority: (priority: 'baixa' | 'media' | 'alta') => void;
}

export function TaskPrioritySection({
  priority,
  setPriority
}: TaskPrioritySectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Prioridade</label>
      <Select value={priority} onValueChange={(value: 'baixa' | 'media' | 'alta') => setPriority(value)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="baixa">Baixa</SelectItem>
          <SelectItem value="media">Média</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
