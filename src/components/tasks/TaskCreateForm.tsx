
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  platform: string;
  assignee: 'executor' | 'modelo';
  timeEstimate: number;
  deadline?: Date;
}

export function TaskCreateForm() {
  const [deadline, setDeadline] = useState<Date>();
  const { createTask, isCreating } = useTasks();
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      priority: 'media',
      assignee: 'executor',
      platform: '',
      timeEstimate: 60
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'elapsedTime' | 'timerStatus'> = {
        title: data.title,
        description: data.description,
        status: 'todo',
        priority: data.priority,
        platform: data.platform,
        assignee: data.assignee,
        timeEstimate: data.timeEstimate,
        timeType: 'estimate',
        deadline,
        checklist: [],
        timerStartTime: undefined,
        completedAt: undefined
      };

      createTask(taskData);
      
      // Reset form
      reset();
      setDeadline(undefined);
      
      toast({
        title: "Tarefa criada com sucesso!",
        description: "A nova tarefa foi adicionada à sua lista."
      });
    } catch (error) {
      toast({
        title: "Erro ao criar tarefa",
        description: "Houve um problema ao criar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Plus className="h-5 w-5" />
          Nova Tarefa
        </CardTitle>
        <CardDescription>
          Crie uma nova tarefa para acompanhar seu progresso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título *</label>
            <Input
              {...register('title', { required: 'Título é obrigatório' })}
              placeholder="Digite o título da tarefa"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              {...register('description')}
              placeholder="Descreva a tarefa (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridade</label>
              <Select onValueChange={(value) => setValue('priority', value as 'baixa' | 'media' | 'alta')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Responsável</label>
              <Select onValueChange={(value) => setValue('assignee', value as 'executor' | 'modelo')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executor">Executor</SelectItem>
                  <SelectItem value="modelo">Modelo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plataforma</label>
              <Input
                {...register('platform')}
                placeholder="Ex: Instagram, TikTok, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo estimado (minutos)</label>
              <Input
                type="number"
                {...register('timeEstimate', { 
                  valueAsNumber: true,
                  min: { value: 1, message: 'Tempo deve ser maior que 0' }
                })}
                placeholder="60"
                className={errors.timeEstimate ? 'border-red-500' : ''}
              />
              {errors.timeEstimate && (
                <p className="text-sm text-red-500">{errors.timeEstimate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prazo final (opcional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!deadline && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isCreating ? 'Criando...' : 'Criar Tarefa'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setDeadline(undefined);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
