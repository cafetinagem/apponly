
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Paperclip, Heart } from 'lucide-react';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    category: string;
    modelId?: string;
    attachmentUrl?: string;
    createdAt: Date;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite?: (noteId: string) => Promise<boolean>;
  isFavorite?: (noteId: string) => boolean;
  getModelName: (modelId?: string) => string;
  getCategoryColor: (categoryName: string) => string;
}

export function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  isFavorite,
  getModelName, 
  getCategoryColor 
}: NoteCardProps) {
  const categoryColor = getCategoryColor(note.category);
  const isNoteFavorite = isFavorite ? isFavorite(note.id) : false;
  
  // Limitar o conteúdo para preview
  const contentPreview = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content;

  const handleToggleFavorite = async () => {
    if (onToggleFavorite) {
      await onToggleFavorite(note.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow no-horizontal-overflow w-full">
      <CardHeader className="pb-3 p-3">
        <div className="flex items-start justify-between gap-2 w-full">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">{note.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {note.category && (
                <Badge 
                  variant="secondary"
                  className="text-white text-xs px-2 py-1"
                  style={{ backgroundColor: categoryColor }}
                >
                  {note.category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-2 py-1">
                {getModelName(note.modelId)}
              </Badge>
              {note.attachmentUrl && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                  <Paperclip className="h-3 w-3" />
                  <span>Anexo</span>
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`h-8 w-8 p-0 touch-target-small ${isNoteFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-4 w-4 ${isNoteFavorite ? 'fill-current' : ''}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 touch-target-small"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 touch-target-small"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        <div 
          className="text-sm text-gray-700 mb-3 prose prose-sm max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: contentPreview }}
        />
        
        <div className="text-xs text-gray-500">
          {format(note.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
      </CardContent>
    </Card>
  );
}
