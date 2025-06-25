import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Heart, Tag, Filter, StickyNote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotesHeaderProps {
  onCreateNote: () => void;
}

export function NotesHeader({ onCreateNote }: NotesHeaderProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 p-2.5 rounded-lg shadow-sm">
            <StickyNote className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-light text-foreground tracking-tight">
              Sistema de Notas
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded">
                OnlyCat Command Center
              </span>
              <span className="text-muted-foreground text-sm">
                Organize suas anotações e ideias importantes
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="btn-elegant h-10 px-4 border-border hover:border-primary/50 hover:bg-accent">
              ← Dashboard
            </Button>
          </Link>
          <Button 
            onClick={onCreateNote}
            className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-10 px-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* Cards de recursos elegantes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-elegant bg-card border-border hover:border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Criar & Editar</p>
                <p className="text-sm text-foreground">Editor rico com formatação</p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-6 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">Ativo</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-elegant bg-card border-border hover:border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categorização</p>
                <p className="text-sm text-foreground">Organize por categorias</p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-6 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">Ativo</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Filter className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-elegant bg-card border-border hover:border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Favoritos</p>
                <p className="text-sm text-foreground">Notas importantes</p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-6 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">Ativo</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-elegant bg-card border-border hover:border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags & Busca</p>
                <p className="text-sm text-foreground">Sistema avançado</p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-6 bg-primary rounded-full"></div>
                  <span className="text-xs text-primary font-medium">Ativo</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Tag className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
