
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteModelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modelName: string;
  isDeleting?: boolean;
}

export const DeleteModelDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  modelName,
  isDeleting = false 
}: DeleteModelDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertDialogTitle>Excluir Modelo</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Tem certeza que deseja excluir a modelo <strong>{modelName}</strong>?
            <br />
            Todos os dados vinculados a ela serão perdidos permanentemente.
            <br />
            <span className="text-red-600 font-medium">Essa ação é irreversível.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Excluindo..." : "Excluir Modelo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
