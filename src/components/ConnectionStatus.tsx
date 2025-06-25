
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, RotateCcw } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, isReconnecting, reconnectAttempts, maxReconnectAttempts, reconnect } = useConnectionStatus();

  if (isConnected) {
    return null; // Não mostrar nada quando conectado
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <WifiOff className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="text-red-800 font-medium">
            {isReconnecting ? 'Reconectando...' : 'Conexão perdida'}
          </span>
          <span className="text-red-600 text-sm ml-2">
            {isReconnecting && `(${reconnectAttempts}/${maxReconnectAttempts})`}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={reconnect}
          disabled={isReconnecting || reconnectAttempts >= maxReconnectAttempts}
          className="ml-4"
        >
          <RotateCcw className={`h-4 w-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
          {isReconnecting ? 'Reconectando...' : 'Tentar novamente'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
