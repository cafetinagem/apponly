
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModelSession, Model } from '@/lib/types';
import { Clock, MapPin, Video, Edit, Trash2, Play, CheckCircle } from 'lucide-react';

interface DaySessionsPanelProps {
  selectedDate: Date | null;
  sessions: ModelSession[];
  models: Model[];
  onSessionUpdate: (sessionId: string, updates: Partial<ModelSession>) => void;
  onSessionDelete: (sessionId: string) => void;
}

export const DaySessionsPanel = ({
  selectedDate,
  sessions,
  models,
  onSessionUpdate,
  onSessionDelete
}: DaySessionsPanelProps) => {
  const getModel = (modelId: string) => {
    return models.find(m => m.id === modelId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = (sessionId: string, newStatus: string) => {
    onSessionUpdate(sessionId, { status: newStatus as any });
  };

  if (!selectedDate) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Hoje</h3>
          <p className="text-gray-500 mb-4">Selecione uma data</p>
          <div className="text-sm text-gray-400">
            Clique em uma data no calendário para ver as calls do dia.
          </div>
        </div>
      </Card>
    );
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold mb-1">
          {isToday ? 'Hoje' : formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-500">
          {sessions.length} {sessions.length === 1 ? 'call agendada' : 'calls agendadas'}
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Clock className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-gray-500">Nenhuma call agendada para este dia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => {
            const model = getModel(session.modelId);
            
            return (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={model?.portfolioImages[0]?.url} />
                      <AvatarFallback>
                        {model?.name.charAt(0)}{model?.name.charAt(1)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-gray-600">{model?.name}</p>
                    </div>
                  </div>

                  <Badge className={getStatusColor(session.status)}>
                    {getStatusLabel(session.status)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{session.startTime}</span>
                    {session.endTime && <span> - {session.endTime}</span>}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{session.location}</span>
                  </div>

                  {session.meetingLink && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Video className="h-4 w-4 mr-2" />
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link da reunião
                      </a>
                    </div>
                  )}

                  {session.clientName && (
                    <div className="text-sm text-gray-600">
                      <strong>Cliente:</strong> {session.clientName}
                    </div>
                  )}

                  {session.payment && (
                    <div className="text-sm text-gray-600">
                      <strong>Valor:</strong> R$ {session.payment.toFixed(2)}
                    </div>
                  )}
                </div>

                {session.description && (
                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {session.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(session.id, 'in-progress')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar
                      </Button>
                    )}

                    {session.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(session.id, 'completed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluir
                      </Button>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onSessionDelete(session.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
