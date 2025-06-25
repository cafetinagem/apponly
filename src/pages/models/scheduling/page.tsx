import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useModels } from '@/hooks/useModels';
import { useSessionData } from '@/hooks/sessions/useSessionData';
import { useSessionOperations } from '@/hooks/sessions/useSessionOperations';
import { Plus, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';

function ModelsSchedulingPageContent() {
  const { models } = useModels();
  const { sessions, refreshSessions } = useSessionData();
  const { createSession } = useSessionOperations();

  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    location: '',
    modelId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.modelId || !newSession.date || !newSession.startTime) {
      toast('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const sessionData = {
        title: newSession.title,
        description: newSession.description,
        location: newSession.location,
        model_id: newSession.modelId,
        date: newSession.date,
        start_time: newSession.startTime,
        end_time: newSession.endTime
      };

      await createSession(sessionData);
      setIsCreateDialogOpen(false);
      setNewSession({
        title: '',
        description: '',
        location: '',
        modelId: '',
        date: '',
        startTime: '',
        endTime: ''
      });
      toast('Sessão criada com sucesso!');
      refreshSessions();
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast('Erro ao criar sessão');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie os agendamentos dos modelos</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Sessão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="Título da sessão"
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo*</Label>
                <Select value={newSession.modelId} onValueChange={(value) => setNewSession({ ...newSession, modelId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Data*</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Início*</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Fim</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  placeholder="Local da sessão"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Descrição da sessão"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleCreateSession} className="flex-1">
                  Criar Sessão
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Próximas Sessões
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{session.date}</span>
                        <span>{session.start_time}</span>
                        {session.location && <span>{session.location}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{session.status || 'Agendado'}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma sessão agendada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ModelsSchedulingPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ModelsSchedulingPageContent />
      </MainLayout>
    </ProtectedRoute>
  );
}
