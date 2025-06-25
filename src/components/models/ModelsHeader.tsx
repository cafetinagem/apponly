import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const ModelsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
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
              Sistema de gestão de modelos
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
          onClick={() => navigate('/models/register')}
          className="btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-10 px-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>
    </div>
  );
};
