
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, Plus } from 'lucide-react';
import { ModelAppointment } from '@/hooks/appointments/types';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';
import { EditAppointmentDialog } from './EditAppointmentDialog';
import { ConfirmCancelDialog } from './ConfirmCancelDialog';
import { useToast } from '@/hooks/use-toast';

interface ModelAppointmentsDialogProps {
  modelId: string;
  modelName: string;
  appointments: ModelAppointment[];
  open: boolean;
  onClose: () => void;
  onCreateAppointment: (appointmentData: any) => Promise<void>;
  onDeleteAppointment: (id: string) => Promise<void>;
}

export const ModelAppointmentsDialog = ({ 
  modelId,
  modelName,
  appointments, 
  open, 
  onClose,
  onCreateAppointment,
  onDeleteAppointment
}: ModelAppointmentsDialogProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ModelAppointment | null>(null);
  const [confirmCancelDialog, setConfirmCancelDialog] = useState<{
    open: boolean;
    appointment: ModelAppointment | null;
  }>({ open: false, appointment: null });
  const [deletingAppointment, setDeletingAppointment] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds if present
  };

  const getRecurrenceLabel = (appointment: ModelAppointment) => {
    if (!appointment.is_recurring) return 'Não';
    
    const labels = {
      daily: 'Diária',
      weekly: 'Semanal',
      monthly: 'Mensal'
    };
    
    return labels[appointment.recurrence_type as keyof typeof labels] || 'Sim';
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  const handleCancelClick = (appointment: ModelAppointment) => {
    setConfirmCancelDialog({
      open: true,
      appointment
    });
  };

  const handleConfirmCancel = async () => {
    if (!confirmCancelDialog.appointment) return;

    try {
      setDeletingAppointment(confirmCancelDialog.appointment.id);
      await onDeleteAppointment(confirmCancelDialog.appointment.id);
      
      toast({
        title: "Sucesso",
        description: "Agendamento cancelado com sucesso!"
      });
      
      setConfirmCancelDialog({ open: false, appointment: null });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar o agendamento",
        variant: "destructive"
      });
    } finally {
      setDeletingAppointment(null);
    }
  };

  const handleEdit = (appointment: ModelAppointment) => {
    setEditingAppointment(appointment);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>📋 Agendamentos - {modelName}</span>
              <Button onClick={() => setShowCreateDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Nenhum agendamento encontrado</p>
              <p className="text-sm text-gray-400">Clique em "Novo Agendamento" para criar o primeiro</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Recorrente</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{appointment.title}</span>
                        {isUpcoming(appointment.date) && (
                          <Badge variant="outline" className="text-green-600">
                            Futuro
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>
                      {formatTime(appointment.start_time)}–{formatTime(appointment.end_time)}
                    </TableCell>
                    <TableCell>{getRecurrenceLabel(appointment)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {appointment.notes || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(appointment)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isUpcoming(appointment.date) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancelClick(appointment)}
                            className="text-red-600 hover:text-red-700"
                            title="❌ Cancelar Agendamento"
                            disabled={deletingAppointment === appointment.id}
                          >
                            {deletingAppointment === appointment.id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <CreateAppointmentDialog
        modelId={modelId}
        modelName={modelName}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={onCreateAppointment}
      />

      {editingAppointment && (
        <EditAppointmentDialog
          appointment={editingAppointment}
          modelName={modelName}
          open={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={onCreateAppointment}
        />
      )}

      <ConfirmCancelDialog
        open={confirmCancelDialog.open}
        onClose={() => setConfirmCancelDialog({ open: false, appointment: null })}
        onConfirm={handleConfirmCancel}
        appointmentTitle={confirmCancelDialog.appointment?.title || ''}
        isDeleting={!!deletingAppointment}
      />
    </>
  );
};
