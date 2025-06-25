import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UnifiedAuthTabs } from '@/components/auth/UnifiedAuthTabs';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { forceAuthReset } from '@/components/auth/authCleanupUtils';
import { logger } from '@/lib/logger';

export default function AuthPage() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const { loading, secureSignIn, secureSignUp } = useSecureAuth();

  const handleSignIn = async (email: string, password: string) => {
    setError('');
    setSuccessMessage('');

    logger.info('AuthPage', 'Processando login para:', email);
    
    const isAdminLogin = email === 'onlycatbrasil@gmail.com';
    
    if (isAdminLogin) {
      logger.admin('AuthPage', 'LOGIN ADMINISTRATIVO DETECTADO');
    }

    await forceAuthReset();
    
    const { error } = await secureSignIn(email, password);
    
    if (error) {
      setAttemptCount(prev => prev + 1);
      
      logger.failure('AuthPage', 'Erro no login:', error.message);
      
      if (isAdminLogin) {
        logger.failure('AuthPage', 'FALHA NO ACESSO ADMINISTRATIVO');
        
        if (error.message?.includes('Invalid login credentials')) {
          setError('🚨 ACESSO ADMINISTRATIVO NEGADO: Credenciais inválidas. Verifique email e senha cadastrados no sistema.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('📧 CONTA ADMINISTRATIVA NÃO CONFIRMADA: Verifique sua caixa de entrada ou entre em contato com o suporte técnico.');
        } else if (error.message?.includes('Too many requests')) {
          setError('⏰ MUITAS TENTATIVAS ADMINISTRATIVAS: Aguarde 5 minutos antes de tentar novamente.');
        } else {
          setError(`🛑 ERRO ADMINISTRATIVO: ${error.message}`);
        }
      } else {
        if (error.message?.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique suas credenciais.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Email não confirmado. Verifique sua caixa de entrada.');
        } else if (error.message?.includes('Too many requests')) {
          setError('Muitas tentativas de login. Aguarde alguns minutos.');
        } else {
          setError(`Erro no login: ${error.message}`);
        }
      }
    } else {
      logger.success('AuthPage', 'Login realizado com sucesso, gerenciando redirecionamento...');
      
      if (isAdminLogin) {
        logger.admin('AuthPage', 'REDIRECIONAMENTO ADMINISTRATIVO SERÁ GERENCIADO PELO useSecureAuth');
        setSuccessMessage('🎉 ACESSO ADMINISTRATIVO CONCEDIDO! Redirecionando para painel administrativo...');
      } else {
        setSuccessMessage('Login realizado com sucesso! Redirecionando para dashboard...');
      }
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setError('');
    setSuccessMessage('');

    await forceAuthReset();

    const { error } = await secureSignUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Conta criada com validações de segurança! Aguarde a aprovação da nossa equipe. Verifique seu email para confirmar o cadastro.');
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center space-y-3 pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">OC</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              OnlyCat Brasil
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base px-2">
              Sistema Seguro de Gestão para Modelos e Tarefas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
            <UnifiedAuthTabs 
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              loading={loading}
              mode="secure"
              showSignUp={true}
            />
            
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20" variant="destructive">
                <AlertDescription className="text-red-800 dark:text-red-200 text-sm break-words">{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <AlertDescription className="text-green-800 dark:text-green-200 text-sm break-words">{successMessage}</AlertDescription>
              </Alert>
            )}

            {attemptCount > 2 && (
              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm break-words">
                  🔐 MÚLTIPLAS TENTATIVAS DETECTADAS: Para acesso administrativo, certifique-se de usar as credenciais corretas 
                  cadastradas no sistema. Não há senhas padrão por segurança.
                </AlertDescription>
              </Alert>
            )}

            {attemptCount > 5 && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20" variant="destructive">
                <AlertDescription className="text-red-800 dark:text-red-200 text-xs sm:text-sm break-words">
                  🛑 BLOQUEIO TEMPORÁRIO: Muitas tentativas falharam. Aguarde 5 minutos antes de tentar novamente.
                  Para suporte técnico administrativo, documente este erro.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
