'use client';

import { useState, useEffect, useMemo } from 'react';
import { useModels } from '@/hooks/useModels';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ModelsHeader } from '@/components/models/ModelsHeader';
import { ModelsFilters } from '@/components/models/ModelsFilters';
import { ModelsList } from '@/components/models/ModelsList';
import { EditModelDialog } from '@/components/models/EditModelDialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { PlatformData } from '@/hooks/models/types';
import { Users, UserCheck, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ModelsPage = () => {
  const { models, loading, updateModel, deleteModel, refreshModels } = useModels();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingModel, setEditingModel] = useState<any>(null);

  // Memoize filtered models to prevent unnecessary recalculations
  const filteredModels = useMemo(() => {
    let filtered = models;

    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (model.artistic_name && model.artistic_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (model.bio && model.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(model => model.status === statusFilter);
    }

    return filtered;
  }, [models, searchTerm, statusFilter]);

  // Statistics calculations
  const stats = useMemo(() => {
    const total = models.length;
    const active = models.filter(m => m.status === 'active').length;
    const pending = models.filter(m => m.status === 'pending').length;
    const thisMonth = models.filter(m => 
      new Date(m.created_at).getMonth() === new Date().getMonth() &&
      new Date(m.created_at).getFullYear() === new Date().getFullYear()
    ).length;

    return { total, active, pending, thisMonth };
  }, [models]);

  const handleUpdateModel = async (formData: any, platforms: PlatformData[]) => {
    if (!editingModel) return;

    try {
      await updateModel(editingModel.id, {
        name: formData.name,
        artistic_name: formData.artistic_name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        status: formData.status,
        age: formData.age ? parseInt(formData.age) : undefined,
        platforms: platforms
      });

      setEditingModel(null);
      toast({
        title: "✅ Modelo atualizado",
        description: "As informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating model:', error);
      toast({
        title: "❌ Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    try {
      await deleteModel(modelId);
      toast({
        title: "✅ Modelo removido",
        description: "O modelo foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "❌ Erro ao remover",
        description: "Não foi possível remover o modelo.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-8 space-y-8">
            
            {/* Header Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 p-2.5 rounded-lg shadow-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-light text-foreground tracking-tight">
                    Gerenciamento de Modelos
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                      OnlyCat Command Center
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {stats.total} {stats.total === 1 ? 'modelo cadastrado' : 'modelos cadastrados'}
                    </span>
                  </div>
                </div>
                
                {/* Theme Toggle */}
                <ThemeToggle />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-elegant bg-card border-border hover:border-primary/20">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total de Modelos</p>
                      <p className="text-3xl font-light text-foreground">{stats.total}</p>
                      <div className="flex items-center space-x-2">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <span className="text-xs text-muted-foreground">100%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-elegant bg-card border-border hover:border-primary/20">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Modelos Ativos</p>
                      <p className="text-3xl font-light text-foreground">{stats.active}</p>
                      <div className="flex items-center space-x-2">
                        <div className="h-1 w-8 bg-primary rounded-full"></div>
                        <span className="text-xs text-primary font-medium">Online</span>
                      </div>
                    </div>
                    <div className="p-3 bg-accent rounded-xl">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-elegant bg-card border-border hover:border-primary/20">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aguardando Aprovação</p>
                      <p className="text-3xl font-light text-foreground">{stats.pending}</p>
                      <div className="flex items-center space-x-2">
                        <div className="h-1 w-4 bg-muted-foreground rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Pendente</span>
                      </div>
                    </div>
                    <div className="p-3 bg-accent rounded-xl">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-elegant bg-card border-border hover:border-primary/20">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Novos Este Mês</p>
                      <p className="text-3xl font-light text-foreground">{stats.thisMonth}</p>
                      <div className="flex items-center space-x-2">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        <span className="text-xs text-primary font-medium">+{stats.thisMonth}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Buscar modelos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-input bg-background text-foreground rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-input bg-background text-foreground rounded-lg focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="pending">Pendentes</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>

              {/* Header Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={refreshModels}
                  disabled={loading}
                  className="px-4 py-2.5 text-sm text-muted-foreground border border-border bg-background hover:bg-accent transition-colors rounded-lg disabled:opacity-50"
                  title="Atualizar lista"
                >
                  {loading ? 'Carregando...' : 'Atualizar'}
                </button>
                
                <button
                  onClick={() => window.location.href = '/models/register'}
                  className="px-4 py-2.5 text-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors rounded-lg flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Novo Modelo
                </button>
              </div>
            </div>

            {/* Models List */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-3 text-muted-foreground">Carregando modelos...</span>
                </div>
              ) : filteredModels.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {searchTerm || statusFilter !== 'all' ? 'Nenhum modelo encontrado' : 'Nenhum modelo cadastrado'}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece cadastrando seu primeiro modelo no sistema'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ModelsList 
                  models={filteredModels}
                  onEditModel={setEditingModel}
                  onDeleteModel={handleDeleteModel}
                />
              )}
            </div>

            {/* Edit Dialog */}
            {editingModel && (
              <EditModelDialog
                model={editingModel}
                open={!!editingModel}
                onClose={() => setEditingModel(null)}
                onSave={handleUpdateModel}
              />
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ModelsPage;
