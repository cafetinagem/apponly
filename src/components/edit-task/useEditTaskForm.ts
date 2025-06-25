import { useState, useEffect } from 'react';
import { Task, ChecklistItem } from '@/lib/types';

export function useEditTaskForm(task: Task | null) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [platform, setPlatform] = useState('none');
  const [customPlatform, setCustomPlatform] = useState('');
  const [assignee, setAssignee] = useState<'executor' | 'modelo'>('executor');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [timeType, setTimeType] = useState<'estimate' | 'deadline'>('estimate');
  const [timeEstimate, setTimeEstimate] = useState<number | undefined>();
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [deadline, setDeadline] = useState<Date | undefined>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setChecklist(task.checklist || []);
      
      // Handle platform logic - check if it's a custom platform
      const predefinedPlatforms = ['none', 'instagram', 'telegram', 'privacy', 'onlyfans', 'chaturbate'];
      if (task.platform && !predefinedPlatforms.includes(task.platform)) {
        setPlatform('outro');
        setCustomPlatform(task.platform);
      } else {
        setPlatform(task.platform || 'none');
        setCustomPlatform('');
      }
      
      setAssignee(task.assignee);
      setPriority(task.priority);
      setTimeType(task.timeType);
      
      // Convert existing time estimate back to display format
      if (task.timeEstimate) {
        // Since we always store in hours, we need to convert for display
        if (task.timeEstimate < 1) {
          // If less than 1 hour, show in minutes
          setTimeEstimate(task.timeEstimate * 60);
          setTimeUnit('minutes');
        } else if (task.timeEstimate >= 8 && task.timeEstimate % 8 === 0) {
          // If it's a multiple of 8 hours, show in days
          setTimeEstimate(task.timeEstimate / 8);
          setTimeUnit('days');
        } else {
          // Otherwise show in hours
          setTimeEstimate(task.timeEstimate);
          setTimeUnit('hours');
        }
      } else {
        setTimeEstimate(undefined);
        setTimeUnit('hours');
      }
      
      setDeadline(task.deadline);
      setNewChecklistItem('');
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setChecklist([]);
    setNewChecklistItem('');
    setPlatform('none');
    setCustomPlatform('');
    setAssignee('executor');
    setPriority('media');
    setTimeType('estimate');
    setTimeEstimate(undefined);
    setTimeUnit('hours');
    setDeadline(undefined);
  };

  const getFormData = () => {
    // Convert time estimate to hours for storage (consistent with database)
    let finalTimeEstimate = timeEstimate;
    if (timeEstimate) {
      switch (timeUnit) {
        case 'minutes':
          finalTimeEstimate = timeEstimate / 60; // Convert minutes to hours
          break;
        case 'hours':
          finalTimeEstimate = timeEstimate; // Keep as hours
          break;
        case 'days':
          finalTimeEstimate = timeEstimate * 8; // Convert days to hours (8 hours per day)
          break;
      }
    }

    // Handle platform logic
    const finalPlatform = platform === 'outro' ? customPlatform : (platform === 'none' ? undefined : platform);

    return {
      title,
      description,
      checklist,
      platform: finalPlatform,
      assignee,
      priority,
      timeType,
      timeEstimate: finalTimeEstimate,
      deadline
    };
  };

  const isFormValid = () => {
    if (!title.trim()) return false;
    if (platform === 'outro' && !customPlatform.trim()) return false;
    return true;
  };

  return {
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
  };
}
