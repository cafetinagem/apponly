
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock } from 'lucide-react';
import { AuthForm } from './AuthForm';

interface AuthTabsProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export function AuthTabs({ onSignIn, onSignUp, loading }: AuthTabsProps) {
  return (
    <Tabs defaultValue="signin" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Entrar</TabsTrigger>
        <TabsTrigger value="signup">Cadastrar</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <AuthForm type="signin" onSubmit={onSignIn} loading={loading} />
      </TabsContent>
      
      <TabsContent value="signup">
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Sistema de Aprovação Manual:</strong> Após o cadastro, sua conta será analisada pela nossa equipe de segurança antes da liberação.
            </AlertDescription>
          </Alert>

          <AuthForm type="signup" onSubmit={onSignUp} loading={loading} />

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Processo de Aprovação:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Cadastro realizado instantaneamente</li>
                  <li>• Equipe notificada automaticamente</li>
                  <li>• Aprovação em até 24h úteis</li>
                  <li>• Notificação por email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
