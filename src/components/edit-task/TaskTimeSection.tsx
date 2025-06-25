
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskTimeSectionProps {
  timeType: 'estimate' | 'deadline';
  setTimeType: (timeType: 'estimate' | 'deadline') => void;
  timeEstimate: number | undefined;
  setTimeEstimate: (estimate: number | undefined) => void;
  timeUnit: 'minutes' | 'hours' | 'days';
  setTimeUnit: (unit: 'minutes' | 'hours' | 'days') => void;
  deadline: Date | undefined;
  setDeadline: (deadline: Date | undefined) => void;
}

export function TaskTimeSection({
  timeType,
  setTimeType,
  timeEstimate,
  setTimeEstimate,
  timeUnit,
  setTimeUnit,
  deadline,
  setDeadline
}: TaskTimeSectionProps) {
  return (
    <div className="space-y-4">
      {/* Tipo de Tempo */}
      <div>
        <label className="block text-sm font-medium mb-2">Tipo de Tempo</label>
        <Select value={timeType} onValueChange={(value: 'estimate' | 'deadline') => setTimeType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estimate">Estimativa (quanto tempo vai levar)</SelectItem>
            <SelectItem value="deadline">Prazo (quando deve ser concluída)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tempo Estimado ou Prazo */}
      {timeType === 'estimate' ? (
        <div>
          <label className="block text-sm font-medium mb-2">Tempo Estimado</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={timeEstimate || ''}
              onChange={(e) => setTimeEstimate(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 30"
              min="0"
              step={timeUnit === 'minutes' ? '15' : '0.5'}
              className="flex-1"
            />
            <Select value={timeUnit} onValueChange={(value: 'minutes' | 'hours' | 'days') => setTimeUnit(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutos</SelectItem>
                <SelectItem value="hours">Horas</SelectItem>
                <SelectItem value="days">Dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">Prazo</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "PPP", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
