'use client';

import { MainLayout } from '@/components/layout/MainLayout';

import { ModelRegistrationForm } from '@/components/models/ModelRegistrationForm';
import { ProtectedRoute } from '@/components/protected-route';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModelsRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-8 space-y-8">
            
            {/* Header Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/models')}
                    className="p-2 border border-border bg-card hover:bg-accent transition-colors rounded-lg"
                    title="Voltar para modelos"
                  >
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 p-2.5 rounded-lg shadow-sm">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-light text-foreground tracking-tight">
                      Cadastrar Novo Modelo
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                        OnlyCat Command Center
                      </span>
                      <span className="text-muted-foreground text-sm">
                        Adicione um novo modelo ao sistema
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Theme Toggle */}
                <ThemeToggle />
              </div>
            </div>

            {/* Form */}
            <ModelRegistrationForm />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ModelsRegisterPage;
