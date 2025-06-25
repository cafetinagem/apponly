
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EditTaskForm } from './edit-task/EditTaskForm';
import { useEditTaskForm } from './edit-task/useEditTaskForm';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [saving, setSaving] = useState(false);
  const {
    title, setTitle,
    description, setDescription,
    checklist, setChecklist,
    newChecklistItem, setNewChecklistItem,
    platform, setPlatform,
    assignee, setAssignee,
    priority, setPriority,
    timeType, setTimeType,
    timeEstimate, setTimeEstimate,
    timeUnit, setTimeUnit,
    deadline, setDeadline,
    resetForm,
    getFormData
  } = useEditTaskForm(task);

  const handleSave = async () => {
    if (!task) return;
    
    setSaving(true);
    try {
      const formData = getFormData();
      await onSave(task.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <p className="text-sm text-gray-600">
            Preencha os detalhes da tarefa. Clique em salvar quando terminar.
          </p>
        </DialogHeader>
        
        <EditTaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          checklist={checklist}
          setChecklist={setChecklist}
          newChecklistItem={newChecklistItem}
          setNewChecklistItem={setNewChecklistItem}
          platform={platform}
          setPlatform={setPlatform}
          assignee={assignee}
          setAssignee={setAssignee}
          priority={priority}
          setPriority={setPriority}
          timeType={timeType}
          setTimeType={setTimeType}
          timeEstimate={timeEstimate}
          setTimeEstimate={setTimeEstimate}
          timeUnit={timeUnit}
          setTimeUnit={setTimeUnit}
          deadline={deadline}
          setDeadline={setDeadline}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'Salvando...' : 'Salvar Tarefa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
