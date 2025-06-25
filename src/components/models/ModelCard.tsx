import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Eye,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Model } from '@/hooks/models/types';
import { memo, useCallback } from 'react';

interface ModelCardProps {
  model: Model;
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
}

export const ModelCard = memo(({ model, onEdit, onDelete }: ModelCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativa';
      default: return 'Indefinido';
    }
  }, []);

  const handleEdit = useCallback(() => {
    console.log('✏️ [ModelCard] Editing model:', model.id);
    onEdit(model);
  }, [model, onEdit]);

  const handleDelete = useCallback(() => {
    console.log('🗑️ [ModelCard] Deleting model:', model.id);
    onDelete(model.id);
  }, [model.id, onDelete]);

  const handleViewProfile = useCallback(() => {
    navigate(`/models/${model.id}`);
  }, [navigate, model.id]);

  const handleSchedule = useCallback(() => {
    navigate('/models/scheduling');
  }, [navigate]);

  return (
    <Card 
      className="card-hover animate-fade-in border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage 
                src={model.photos?.[0]} 
                alt={model.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium">
                {model.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{model.name}</h3>
              {model.artistic_name && (
                <p className="text-sm text-muted-foreground truncate">"{model.artistic_name}"</p>
              )}
              <div className="mt-1">
                <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(model.status)}`}></span>
                <span className="ml-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {getStatusText(model.status)}
                </span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-accent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleViewProfile} className="text-sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} className="text-sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSchedule} className="text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-sm text-destructive focus:text-destructive"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-3 text-muted-foreground/70" />
            <span className="truncate">{model.email}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-3 text-muted-foreground/70" />
            <span>{model.phone}</span>
          </div>
          
          {(model.city || model.state) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-3 text-muted-foreground/70" />
              <span>{model.city}{model.city && model.state ? ', ' : ''}{model.state}</span>
            </div>
          )}
        </div>

        {/* Platforms */}
        {model.platforms && model.platforms.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {model.platforms.slice(0, 2).map((platform, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground border border-border"
                >
                  {platform.name}
                </span>
              ))}
              {model.platforms.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground border border-border">
                  +{model.platforms.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex space-x-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 px-3 py-2 text-sm border border-border text-foreground hover:bg-accent transition-colors"
          >
            Ver Perfil
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Editar
          </button>
        </div>
      </div>
    </Card>
  );
});

ModelCard.displayName = 'ModelCard';
