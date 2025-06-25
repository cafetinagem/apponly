
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onRetry?: () => void;
  maxRetries?: number;
  showToast?: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: any, 
    operation: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const { onRetry, maxRetries = 3, showToast = true } = options;
    
    console.error(`Erro em ${operation}:`, error);

    let errorMessage = 'Erro inesperado';
    let shouldRetry = false;

    // Categorizar tipos de erro
    if (error?.message?.includes('Failed to fetch')) {
      errorMessage = 'Problema de conexão. Verifique sua internet.';
      shouldRetry = true;
    } else if (error?.message?.includes('timeout')) {
      errorMessage = 'Operação demorou muito. Tente novamente.';
      shouldRetry = true;
    } else if (error?.message?.includes('unauthorized')) {
      errorMessage = 'Acesso negado. Faça login novamente.';
    } else if (error?.message?.includes('not found')) {
      errorMessage = 'Recurso não encontrado.';
    } else if (error?.code === 'PGRST116') {
      errorMessage = 'Dados não encontrados.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    if (showToast) {
      const toastConfig: any = {
        title: `Erro: ${operation}`,
        description: errorMessage,
        variant: "destructive",
        duration: shouldRetry ? 5000 : 3000,
      };

      // Se há retry disponível, adiciona ação personalizada
      if (shouldRetry && onRetry) {
        toastConfig.action = {
          altText: "Tentar novamente",
          onClick: onRetry
        };
      }

      toast(toastConfig);
    }

    return {
      message: errorMessage,
      shouldRetry,
      canRetry: shouldRetry && onRetry && maxRetries > 0
    };
  }, [toast]);

  const withErrorHandler = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    operation: string,
    options?: ErrorHandlerOptions
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, operation, options);
        return null;
      }
    };
  }, [handleError]);

  return {
    handleError,
    withErrorHandler
  };
}
