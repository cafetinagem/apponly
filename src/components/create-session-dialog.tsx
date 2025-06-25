
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Model } from '@/lib/types';

interface CreateSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  models: Model[];
  selectedDate: Date | null;
}

export const CreateSessionDialog = ({
  isOpen,
  onClose,
  onSubmit,
  models,
  selectedDate
}: CreateSessionDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modelId: '',
    date: selectedDate || new Date(),
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: '',
    sessionType: '',
    clientName: '',
    clientContact: '',
    payment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionData = {
      ...formData,
      payment: formData.payment ? parseFloat(formData.payment) : undefined,
      date: selectedDate || formData.date,
    };

    onSubmit(sessionData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      modelId: '',
      date: selectedDate || new Date(),
      startTime: '',
      endTime: '',
      location: '',
      meetingLink: '',
      sessionType: '',
      clientName: '',
      clientContact: '',
      payment: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Call</DialogTitle>
          <DialogDescription>
            Agende uma nova call com um modelo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Sessão de fotos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Select value={formData.modelId} onValueChange={(value) => handleInputChange('modelId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.filter(m => m.status === 'active' && m.id).map(model => (
                    <SelectItem key={model.id} value={model.id || `model-${Math.random()}`}>
                      {model.name} {model.artisticName && `(${model.artisticName})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detalhes da sessão..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário Fim</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionType">Tipo</Label>
              <Select value={formData.sessionType} onValueChange={(value) => handleInputChange('sessionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de sessão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Fotos</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ex: Estúdio, Endereço, Online"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingLink">Link da Reunião</Label>
            <Input
              id="meetingLink"
              type="url"
              value={formData.meetingLink}
              onChange={(e) => handleInputChange('meetingLink', e.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientContact">Contato do Cliente</Label>
              <Input
                id="clientContact"
                value={formData.clientContact}
                onChange={(e) => handleInputChange('clientContact', e.target.value)}
                placeholder="Telefone ou email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Valor (R$)</Label>
            <Input
              id="payment"
              type="number"
              step="0.01"
              value={formData.payment}
              onChange={(e) => handleInputChange('payment', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Agendar Call
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
