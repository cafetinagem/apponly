
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EditTaskForm } from './edit-task/EditTaskForm';
import { useEditTaskForm } from './edit-task/useEditTaskForm';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'elapsedTime' | 'timerStatus'>) => Promise<any>;
}

export function CreateTaskDialog({ open, onOpenChange, onSave }: CreateTaskDialogProps) {
  const [saving, setSaving] = useState(false);
  const {
    title, setTitle,
    description, setDescription,
    checklist, setChecklist,
    newChecklistItem, setNewChecklistItem,
    platform, setPlatform,
    customPlatform, setCustomPlatform,
    assignee, setAssignee,
    priority, setPriority,
    timeType, setTimeType,
    timeEstimate, setTimeEstimate,
    timeUnit, setTimeUnit,
    deadline, setDeadline,
    resetForm,
    getFormData,
    isFormValid
  } = useEditTaskForm(null);

  const handleSave = async () => {
    if (!isFormValid()) return;
    
    setSaving(true);
    try {
      const formData = getFormData();
      const taskData = {
        ...formData,
        status: 'todo' as const,
        elapsedTime: 0,
        timerStatus: 'idle' as const,
        timerStartTime: undefined,
        completedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await onSave(taskData);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
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
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <p className="text-sm text-gray-600">
            Preencha os detalhes da nova tarefa. Clique em criar quando terminar.
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
          customPlatform={customPlatform}
          setCustomPlatform={setCustomPlatform}
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
          <Button 
            onClick={handleSave} 
            disabled={saving || !isFormValid()}
          >
            {saving ? 'Criando...' : 'Criar Tarefa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
