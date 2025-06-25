import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { TaskDashboard } from '@/components/tasks/TaskDashboard';
import { TaskStatusNavigator } from '@/components/tasks/TaskStatusNavigator';
import { TaskCreateForm } from '@/components/tasks/TaskCreateForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, CheckSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAllTasks } from '@/hooks/useTasks';

export default function TasksMainPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, loading } = useAllTasks();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Determinar tab ativa baseada na URL
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/create')) {
      setActiveTab('create');
    } else if (path.includes('/todo')) {
      setActiveTab('todo');
    } else if (path.includes('/in-progress')) {
      setActiveTab('in-progress');
    } else if (path.includes('/completed')) {
      setActiveTab('completed');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case 'dashboard':
        navigate('/tasks');
        break;
      case 'create':
        navigate('/tasks/create');
        break;
      case 'todo':
        navigate('/tasks/todo');
        break;
      case 'in-progress':
        navigate('/tasks/in-progress');
        break;
      case 'completed':
        navigate('/tasks/completed');
        break;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header profissional */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 p-2.5 rounded-lg shadow-sm">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-light text-foreground tracking-tight">
                  Gerenciamento de Tarefas
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                    OnlyCat Command Center
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Organize e acompanhe suas atividades
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm" className="btn-elegant h-10 px-4 border-border hover:border-primary/50 hover:bg-accent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={() => setActiveTab('create')}
                className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-10 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Navegador de status */}
          <TaskStatusNavigator />

          {/* Tabs principais */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-[600px]">
              <TabsTrigger value="dashboard">Visão Geral</TabsTrigger>
              <TabsTrigger value="todo">A Fazer</TabsTrigger>
              <TabsTrigger value="in-progress">Em Execução</TabsTrigger>
              <TabsTrigger value="completed">Finalizadas</TabsTrigger>
              <TabsTrigger value="create">Nova Tarefa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <TaskDashboard />
            </TabsContent>
            
            <TabsContent value="todo">
              <TaskList 
                status="todo" 
                title="Tarefas Pendentes"
                description="Tarefas que ainda precisam ser iniciadas"
              />
            </TabsContent>
            
            <TabsContent value="in-progress">
              <TaskList 
                status="in-progress" 
                title="Tarefas em Execução"
                description="Tarefas que estão sendo trabalhadas no momento"
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <TaskList 
                status="done" 
                title="Tarefas Finalizadas"
                description="Tarefas que foram concluídas com sucesso"
              />
            </TabsContent>
            
            <TabsContent value="create">
              <TaskCreateForm />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
