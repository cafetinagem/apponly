
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface TaskErrorBoundaryProps {
  error?: Error;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export function TaskErrorBoundary({ error, onRetry, children }: TaskErrorBoundaryProps) {
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center border-red-200">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Erro ao carregar tarefas
          </h3>
          <p className="text-red-700 mb-4">
            {error.message || 'Ocorreu um erro inesperado ao carregar as tarefas.'}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="text-red-700 border-red-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
