
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { UserApprovalCard } from './UserApprovalCard';

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

interface UserApprovalSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  users: UserProfile[];
  showActions?: boolean;
  maxDisplayed?: number;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onDelete: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
  processingUser: string | null;
  emptyMessage?: string;
  titleColor?: string;
}

export function UserApprovalSection({
  title,
  icon: Icon,
  users,
  showActions = false,
  maxDisplayed,
  onApprove,
  onReject,
  onDelete,
  onPromoteToAdmin,
  processingUser,
  emptyMessage = "Nenhum usuário encontrado",
  titleColor = "text-gray-600 dark:text-gray-400"
}: UserApprovalSectionProps) {
  const displayedUsers = maxDisplayed ? users.slice(0, maxDisplayed) : users;
  const hasMore = maxDisplayed && users.length > maxDisplayed;

  if (users.length === 0 && !showActions) {
    return null;
  }

  return (
    <Card className="shadow-lg border border-gray-200 dark:border-gray-800 animate-smooth-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className={`${titleColor} flex items-center gap-2 text-lg sm:text-xl`}>
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
              {displayedUsers.map((user) => (
                <UserApprovalCard
                  key={user.id}
                  user={user}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                  onPromoteToAdmin={onPromoteToAdmin}
                  isProcessing={processingUser === user.user_id}
                  showActions={showActions}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                ... e mais {users.length - maxDisplayed!} usuários
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
