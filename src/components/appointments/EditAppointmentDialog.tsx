
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModelAppointment } from '@/hooks/appointments/types';
import { useEditAppointmentForm } from '@/hooks/appointments/useEditAppointmentForm';
import { EditAppointmentBasicFields } from './EditAppointmentBasicFields';
import { EditAppointmentRecurrenceFields } from './EditAppointmentRecurrenceFields';

interface EditAppointmentDialogProps {
  appointment: ModelAppointment;
  modelName: string;
  open: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => Promise<void>;
}

export const EditAppointmentDialog = ({ 
  appointment, 
  modelName, 
  open, 
  onClose 
}: EditAppointmentDialogProps) => {
  const {
    formData,
    setFormData,
    loading,
    handleSubmit,
    handleCancel
  } = useEditAppointmentForm(appointment, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>✏️ Editar Agendamento</DialogTitle>
          <p className="text-sm text-gray-600">
            Editando agendamento para {modelName}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <EditAppointmentBasicFields
            formData={formData}
            setFormData={setFormData}
            modelName={modelName}
          />

          <EditAppointmentRecurrenceFields
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : '💾 Salvar Edição'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              ❌ Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
