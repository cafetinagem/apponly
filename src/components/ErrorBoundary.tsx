
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ [ErrorBoundary] Erro capturado:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">
          <Card className="max-w-md w-full shadow-lg border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-900">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-orange-600 dark:text-orange-400">
                Oops! Algo deu errado
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700">
                  {this.state.error.message}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600"
                >
                  Recarregar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
