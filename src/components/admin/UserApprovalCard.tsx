
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Crown } from 'lucide-react';
import { UserApprovalActions } from './UserApprovalActions';

interface UserProfile {
  id: string;
  user_id: string;
  status_conta: 'pendente' | 'aprovado' | 'rejeitado';
  email: string;
  nome: string | null;
  role: 'admin' | 'executor' | 'modelo';
  data_cadastro: string;
  data_aprovacao: string | null;
  aprovado_por: string | null;
}

interface UserApprovalCardProps {
  user: UserProfile;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onDelete: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
  isProcessing: boolean;
  showActions?: boolean;
}

export function UserApprovalCard({
  user,
  onApprove,
  onReject,
  onDelete,
  onPromoteToAdmin,
  isProcessing,
  showActions = false
}: UserApprovalCardProps) {
  const getStatusBadge = (status: string, role: string) => {
    const isAdmin = role === 'admin';
    
    if (isAdmin) {
      return (
        <Badge variant="outline" className="text-purple-600 border-purple-600 dark:text-purple-400 dark:border-purple-400 text-xs font-medium">
          <Crown className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    
    switch (status) {
      case 'pendente':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400 text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'aprovado':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400 text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case 'rejeitado':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 dark:text-red-400 dark:border-red-400 text-xs font-medium">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getCardClassName = () => {
    const baseClasses = "transition-all duration-200 hover-lift border";
    
    switch (user.status_conta) {
      case 'pendente':
        return `${baseClasses} border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20`;
      case 'aprovado':
        return `${baseClasses} border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20`;
      case 'rejeitado':
        return `${baseClasses} border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20`;
      default:
        return `${baseClasses} border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900`;
    }
  };

  return (
    <Card className={getCardClassName()}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex-1 space-y-3">
          {/* Header com nome e status */}
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm leading-tight">
                {user.nome || 'Nome não informado'}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">
                {user.email}
              </p>
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(user.status_conta, user.role)}
            </div>
          </div>

          {/* Data de cadastro */}
          <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="font-medium">Cadastrado:</span> {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Ações (apenas para pendentes) */}
        {showActions && user.status_conta === 'pendente' && (
          <UserApprovalActions
            userId={user.user_id}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            onPromoteToAdmin={onPromoteToAdmin}
            isProcessing={isProcessing}
          />
        )}
      </CardContent>
    </Card>
  );
}
