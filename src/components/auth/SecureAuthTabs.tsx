
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, Lock } from 'lucide-react';
import { SecureAuthForm } from './SecureAuthForm';

interface SecureAuthTabsProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export function SecureAuthTabs({ onSignIn, onSignUp, loading }: SecureAuthTabsProps) {
  return (
    <Tabs defaultValue="signin" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Entrar</TabsTrigger>
        <TabsTrigger value="signup">Cadastrar</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <SecureAuthForm type="signin" onSubmit={onSignIn} loading={loading} />
      </TabsContent>
      
      <TabsContent value="signup">
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Sistema de Segurança Avançada:</strong> Senhas são verificadas contra vazamentos conhecidos e requerem aprovação manual da equipe.
            </AlertDescription>
          </Alert>

          <SecureAuthForm type="signup" onSubmit={onSignUp} loading={loading} />

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Lock className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Validações de Segurança:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Verificação contra senhas vazadas</li>
                  <li>• Força mínima de 8 caracteres</li>
                  <li>• Maiúscula, minúscula e número obrigatórios</li>
                  <li>• Aprovação manual em até 24h</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
