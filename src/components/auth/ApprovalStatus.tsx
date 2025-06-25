
import React, { useEffect } from 'react';
import { useUserApproval } from '@/hooks/useUserApproval';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle, Mail, Shield, AlertTriangle } from 'lucide-react';

export function ApprovalStatus() {
  const { userProfile, loading, isApproved, isPending, isRejected, notificationSent } = useUserApproval();
  const { signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isApproved) {
    return null; // Usuário aprovado, não exibir nada
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            {isPending && <Clock className="h-8 w-8 text-yellow-600" />}
            {isRejected && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          <CardTitle className="text-xl font-bold">
            {isPending && "Aguardando Aprovação"}
            {isRejected && "Acesso Negado"}
          </CardTitle>
          <CardDescription>
            Sistema de Gestão OnlyCat Brasil
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isPending && (
            <>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Sua conta foi criada com sucesso e está aguardando aprovação da nossa equipe de segurança.
                </AlertDescription>
              </Alert>
              
              <div className={`p-4 rounded-lg border ${notificationSent ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-start space-x-3">
                  {notificationSent ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${notificationSent ? 'text-green-900' : 'text-yellow-900'}`}>
                      {notificationSent ? 'Administrador Notificado' : 'Enviando Notificação...'}
                    </p>
                    <p className={`text-sm mt-1 ${notificationSent ? 'text-green-700' : 'text-yellow-700'}`}>
                      {notificationSent 
                        ? 'Nossa equipe foi notificada sobre sua solicitação de acesso.'
                        : 'Aguarde enquanto notificamos nossa equipe...'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Email cadastrado:</strong> {userProfile?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Data do cadastro:</strong> {userProfile?.data_cadastro ? new Date(userProfile.data_cadastro).toLocaleString('pt-BR') : '-'}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  ⏱️ O processo de aprovação pode levar até 24 horas úteis. 
                  Você receberá um email quando sua conta for aprovada.
                </p>
              </div>
            </>
          )}

          {isRejected && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Sua solicitação de acesso foi rejeitada. Entre em contato com nossa equipe para mais informações.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  <strong>Email de contato:</strong> onlycatbrasil@gmail.com
                </p>
              </div>
            </>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full"
            >
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
