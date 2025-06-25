
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Operation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'upload';
  status: 'pending' | 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}

interface NotesProgressIndicatorProps {
  operations: Operation[];
  onComplete: (operationId: string) => void;
}

export function NotesProgressIndicator({ operations, onComplete }: NotesProgressIndicatorProps) {
  if (operations.length === 0) {
    return null;
  }

  const getIcon = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVariant = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {operations.map((operation) => (
        <Alert key={operation.id} variant={getVariant(operation.status)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(operation.status)}
              <AlertDescription className="flex-1">
                {operation.message || `${operation.type} em andamento...`}
              </AlertDescription>
            </div>
            
            {(operation.status === 'completed' || operation.status === 'error') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete(operation.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {operation.progress !== undefined && (
            <Progress value={operation.progress} className="mt-2" />
          )}
        </Alert>
      ))}
    </div>
  );
}
