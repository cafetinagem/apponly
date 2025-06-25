
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateAppointmentData } from '@/hooks/appointments/types';

interface CreateAppointmentDialogProps {
  modelId: string;
  modelName: string;
  open: boolean;
  onClose: () => void;
  onSave: (appointmentData: CreateAppointmentData) => Promise<void>;
}

export const CreateAppointmentDialog = ({ 
  modelId, 
  modelName, 
  open, 
  onClose, 
  onSave 
}: CreateAppointmentDialogProps) => {
  const [formData, setFormData] = useState<CreateAppointmentData>({
    model_id: modelId,
    title: '',
    date: '',
    start_time: '',
    end_time: '',
    is_recurring: false,
    recurrence_type: undefined,
    recurrence_end: undefined,
    notes: '',
    attachment_url: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.start_time || !formData.end_time) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
      setFormData({
        model_id: modelId,
        title: '',
        date: '',
        start_time: '',
        end_time: '',
        is_recurring: false,
        recurrence_type: undefined,
        recurrence_end: undefined,
        notes: '',
        attachment_url: ''
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRecurringChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_recurring: checked,
      recurrence_type: checked ? 'weekly' : undefined,
      recurrence_end: checked ? '' : undefined
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📅 Agendar Horário - {modelName}</DialogTitle>
          <p className="text-sm text-gray-600">
            Crie um novo agendamento para este modelo
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Agendamento*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="ex: Gravação OnlyFans, Reunião, etc."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Data*</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="start_time">Hora de Início*</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_time">Hora de Término*</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={handleRecurringChange}
              />
              <Label htmlFor="recurring">Recorrente?</Label>
            </div>

            {formData.is_recurring && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="recurrence_type">Frequência</Label>
                  <Select 
                    value={formData.recurrence_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence_type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recurrence_end">Até qual data?</Label>
                  <Input
                    id="recurrence_end"
                    type="date"
                    value={formData.recurrence_end || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrence_end: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Detalhes adicionais sobre o agendamento..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="attachment_url">Link ou Arquivo (opcional)</Label>
            <Input
              id="attachment_url"
              value={formData.attachment_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Salvando...' : '💾 Salvar Agendamento'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
