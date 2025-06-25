
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentTitle: string;
  isDeleting: boolean;
}

export const ConfirmCancelDialog = ({
  open,
  onClose,
  onConfirm,
  appointmentTitle,
  isDeleting
}: ConfirmCancelDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>❌ Cancelar Agendamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar o agendamento <strong>"{appointmentTitle}"</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
