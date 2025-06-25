
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundaryWrapper extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-4">
              <div>
                <strong>Oops! Algo deu errado.</strong>
                <p className="text-sm mt-2">
                  Um erro inesperado ocorreu. Por favor, recarregue a página.
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Recarregar Página
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
