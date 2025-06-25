
import React from 'react';
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
import { Trash2 } from 'lucide-react';

interface DeleteTaskConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
  isDeleting?: boolean;
}

export function DeleteTaskConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
  isDeleting = false
}: DeleteTaskConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Excluir Tarefa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2">
            <p>
              Tem certeza que deseja excluir a tarefa{' '}
              <span className="font-medium">"{taskTitle}"</span>?
            </p>
            <p className="text-sm text-gray-600">
              Essa ação é irreversível e todos os dados associados serão apagados.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Tarefa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
