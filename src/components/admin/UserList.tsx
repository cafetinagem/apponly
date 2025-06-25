
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  status_conta: 'pendente' | 'aprovado' | 'rejeitado';
  email: string;
  nome: string | null;
  data_cadastro: string;
  data_aprovacao: string | null;
  aprovado_por: string | null;
}

interface UserListProps {
  users: UserProfile[];
  title: string;
  titleColor: string;
  onUpdateStatus?: (userId: string, status: 'aprovado' | 'rejeitado') => void;
  showActions?: boolean;
  maxDisplay?: number;
}

export function UserList({ 
  users, 
  title, 
  titleColor, 
  onUpdateStatus, 
  showActions = false,
  maxDisplay 
}: UserListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const displayUsers = maxDisplay ? users.slice(0, maxDisplay) : users;
  const remainingCount = maxDisplay && users.length > maxDisplay ? users.length - maxDisplay : 0;

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={titleColor}>{title} ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{user.nome || 'Nome não informado'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">
                  Cadastrado em: {new Date(user.data_cadastro).toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(user.status_conta)}
                {showActions && onUpdateStatus && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(user.user_id, 'aprovado')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onUpdateStatus(user.user_id, 'rejeitado')}
                    >
                      Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="text-center text-sm text-gray-500 pt-2">
              ... e mais {remainingCount} usuários {title.toLowerCase()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
