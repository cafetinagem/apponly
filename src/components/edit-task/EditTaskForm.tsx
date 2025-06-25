
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskChecklistSection } from './TaskChecklistSection';
import { TaskPlatformAssigneeSection } from './TaskPlatformAssigneeSection';
import { TaskPrioritySection } from './TaskPrioritySection';
import { TaskTimeSection } from './TaskTimeSection';
import { ChecklistItem } from '@/lib/types';

interface EditTaskFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  checklist: ChecklistItem[];
  setChecklist: (checklist: ChecklistItem[]) => void;
  newChecklistItem: string;
  setNewChecklistItem: (item: string) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  customPlatform?: string;
  setCustomPlatform?: (platform: string) => void;
  assignee: 'executor' | 'modelo';
  setAssignee: (assignee: 'executor' | 'modelo') => void;
  priority: 'baixa' | 'media' | 'alta';
  setPriority: (priority: 'baixa' | 'media' | 'alta') => void;
  timeType: 'estimate' | 'deadline';
  setTimeType: (timeType: 'estimate' | 'deadline') => void;
  timeEstimate?: number;
  setTimeEstimate: (estimate: number | undefined) => void;
  timeUnit: 'minutes' | 'hours' | 'days';
  setTimeUnit: (unit: 'minutes' | 'hours' | 'days') => void;
  deadline?: Date;
  setDeadline: (deadline: Date | undefined) => void;
}

export function EditTaskForm({
  title,
  setTitle,
  description,
  setDescription,
  checklist,
  setChecklist,
  newChecklistItem,
  setNewChecklistItem,
  platform,
  setPlatform,
  customPlatform,
  setCustomPlatform,
  assignee,
  setAssignee,
  priority,
  setPriority,
  timeType,
  setTimeType,
  timeEstimate,
  setTimeEstimate,
  timeUnit,
  setTimeUnit,
  deadline,
  setDeadline
}: EditTaskFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da tarefa"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição da tarefa (opcional)"
            className="w-full min-h-[100px]"
          />
        </div>
      </div>

      {/* Checklist */}
      <TaskChecklistSection
        checklist={checklist}
        setChecklist={setChecklist}
        newChecklistItem={newChecklistItem}
        setNewChecklistItem={setNewChecklistItem}
      />

      {/* Platform and Assignee */}
      <TaskPlatformAssigneeSection
        platform={platform}
        setPlatform={setPlatform}
        customPlatform={customPlatform}
        setCustomPlatform={setCustomPlatform}
        assignee={assignee}
        setAssignee={setAssignee}
      />

      {/* Priority */}
      <TaskPrioritySection
        priority={priority}
        setPriority={setPriority}
      />

      {/* Time and Deadline */}
      <TaskTimeSection
        timeType={timeType}
        setTimeType={setTimeType}
        timeEstimate={timeEstimate}
        setTimeEstimate={setTimeEstimate}
        timeUnit={timeUnit}
        setTimeUnit={setTimeUnit}
        deadline={deadline}
        setDeadline={setDeadline}
      />
    </div>
  );
}
