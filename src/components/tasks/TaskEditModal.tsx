
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Task } from '@/lib/types';

interface TaskEditModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}

export function TaskEditModal({ task, open, onClose, onSave }: TaskEditModalProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    assignee: task.assignee,
    platform: task.platform || '',
    timeEstimate: task.timeEstimate || 0,
    timeType: task.timeType
  });

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee,
      platform: task.platform || '',
      timeEstimate: task.timeEstimate || 0,
      timeType: task.timeType
    });
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Execução</SelectItem>
                  <SelectItem value="done">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável</Label>
              <Select value={formData.assignee} onValueChange={(value: any) => setFormData({ ...formData, assignee: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executor">Executor</SelectItem>
                  <SelectItem value="modelo">Modelo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="Ex: Instagram, OnlyFans..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeEstimate">Estimativa de Tempo (horas)</Label>
              <Input
                id="timeEstimate"
                type="number"
                value={formData.timeEstimate}
                onChange={(e) => setFormData({ ...formData, timeEstimate: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
