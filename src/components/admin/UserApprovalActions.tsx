
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2, Crown, UserCheck, UserX } from 'lucide-react';

interface UserApprovalActionsProps {
  userId: string;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onDelete: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
  isProcessing: boolean;
}

export function UserApprovalActions({
  userId,
  onApprove,
  onReject,
  onDelete,
  onPromoteToAdmin,
  isProcessing
}: UserApprovalActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
      <Button
        size="sm"
        onClick={() => onApprove(userId)}
        className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none min-w-touch min-h-touch transition-all duration-200 hover-lift"
        disabled={isProcessing}
      >
        <UserCheck className="h-4 w-4 mr-1.5" />
        <span className="hidden xs:inline">Aprovar</span>
        <span className="xs:hidden">✓</span>
      </Button>
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onReject(userId)}
        disabled={isProcessing}
        className="flex-1 sm:flex-none min-w-touch min-h-touch transition-all duration-200 hover-lift"
      >
        <UserX className="h-4 w-4 mr-1.5" />
        <span className="hidden xs:inline">Rejeitar</span>
        <span className="xs:hidden">✕</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(userId)}
        disabled={isProcessing}
        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 flex-1 sm:flex-none min-w-touch min-h-touch transition-all duration-200 hover-lift"
      >
        <Trash2 className="h-4 w-4 mr-1.5" />
        <span className="hidden sm:inline">Excluir</span>
        <span className="sm:hidden">🗑</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPromoteToAdmin(userId)}
        disabled={isProcessing}
        className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 flex-1 sm:flex-none min-w-touch min-h-touch transition-all duration-200 hover-lift"
      >
        <Crown className="h-4 w-4 mr-1.5" />
        <span className="hidden sm:inline">Admin</span>
        <span className="sm:hidden">👑</span>
      </Button>
    </div>
  );
}
