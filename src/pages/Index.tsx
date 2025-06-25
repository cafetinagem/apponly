
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Users, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  console.log('🏠 [Index] Rendering dashboard page');
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
              Dashboard - OnlyCat Brasil
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/tasks">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Gerencie suas tarefas diárias
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/models">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Modelos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Cadastro e gestão de modelos
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/notes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Suas anotações e lembretes
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/models/scheduling">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Calendário e sessões
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo ao OnlyCat Brasil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema completo de gestão para modelos e tarefas. Use o menu lateral para navegar entre as diferentes seções.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
