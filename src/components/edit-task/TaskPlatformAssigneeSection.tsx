
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TaskPlatformAssigneeSectionProps {
  platform: string;
  setPlatform: (platform: string) => void;
  assignee: 'executor' | 'modelo';
  setAssignee: (assignee: 'executor' | 'modelo') => void;
  customPlatform?: string;
  setCustomPlatform?: (platform: string) => void;
}

export function TaskPlatformAssigneeSection({
  platform,
  setPlatform,
  assignee,
  setAssignee,
  customPlatform = '',
  setCustomPlatform
}: TaskPlatformAssigneeSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Plataforma</label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="privacy">Privacy</SelectItem>
            <SelectItem value="onlyfans">OnlyFans</SelectItem>
            <SelectItem value="chaturbate">Chaturbate</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        
        {platform === 'outro' && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Digite o nome da plataforma"
              value={customPlatform}
              onChange={(e) => setCustomPlatform?.(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Responsável</label>
        <Select value={assignee} onValueChange={(value: 'executor' | 'modelo') => setAssignee(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executor">Executor</SelectItem>
            <SelectItem value="modelo">Modelo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
