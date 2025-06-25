
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { ModelAppointment } from '@/hooks/appointments/types';

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrenceType: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd: string;
  notes: string;
}

export function useEditAppointmentForm(appointment: ModelAppointment, onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    recurrenceType: 'weekly',
    recurrenceEnd: '',
    notes: ''
  });

  const { toast } = useToast();
  const { updateAppointment } = useAppointments();

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        date: appointment.date,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        isRecurring: appointment.is_recurring,
        recurrenceType: (appointment.recurrence_type as 'daily' | 'weekly' | 'monthly') || 'weekly',
        recurrenceEnd: appointment.recurrence_end || '',
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.date) {
      toast({
        title: "Erro",
        description: "Data é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.startTime || !formData.endTime) {
      toast({
        title: "Erro",
        description: "Horário de início e fim são obrigatórios",
        variant: "destructive"
      });
      return false;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Erro",
        description: "Horário de início deve ser anterior ao horário de fim",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      const updateData = {
        title: formData.title.trim(),
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        is_recurring: formData.isRecurring,
        recurrence_type: formData.isRecurring ? formData.recurrenceType : null,
        recurrence_end: formData.isRecurring && formData.recurrenceEnd ? formData.recurrenceEnd : null,
        notes: formData.notes.trim() || null
      };

      await updateAppointment(appointment.id, updateData);

      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso!"
      });

      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar agendamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: appointment.title,
      date: appointment.date,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      isRecurring: appointment.is_recurring,
      recurrenceType: (appointment.recurrence_type as 'daily' | 'weekly' | 'monthly') || 'weekly',
      recurrenceEnd: appointment.recurrence_end || '',
      notes: appointment.notes || ''
    });
    onClose();
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
    handleCancel
  };
}
