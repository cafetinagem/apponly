
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { UserStats } from './UserStats';

interface UserApprovalHeaderProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function UserApprovalHeader({ 
  pendingCount, 
  approvedCount, 
  rejectedCount 
}: UserApprovalHeaderProps) {
  return (
    <Card className="shadow-lg border-orange-200 dark:border-orange-800 animate-smooth-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl text-orange-600 dark:text-orange-400">
          <Shield className="h-6 w-6 flex-shrink-0" />
          <span className="truncate">Painel de Aprovação de Usuários</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Gerencie solicitações de acesso ao sistema em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <UserStats 
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
        />
      </CardContent>
    </Card>
  );
}
