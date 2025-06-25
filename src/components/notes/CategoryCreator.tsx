
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryCreatorProps {
  categories: Array<{ id: string; name: string; color: string }>;
  onCreateCategory: (name: string, color?: string) => Promise<any>;
  onCategoryChange: (category: string) => void;
  isCreating: boolean;
  onCreatingChange: (creating: boolean) => void;
}

const colorOptions = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function CategoryCreator({
  categories,
  onCreateCategory,
  onCategoryChange,
  isCreating,
  onCreatingChange
}: CategoryCreatorProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    // Verificar se categoria já existe
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Categoria já existe",
        variant: "destructive"
      });
      return;
    }

    onCreatingChange(true);
    try {
      await onCreateCategory(newCategoryName.trim(), newCategoryColor);
      onCategoryChange(newCategoryName.trim());
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
      setShowNewCategory(false);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      onCreatingChange(false);
    }
  };

  const resetForm = () => {
    setShowNewCategory(false);
    setNewCategoryName('');
    setNewCategoryColor('#3B82F6');
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowNewCategory(!showNewCategory)}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-1" />
        Nova
      </Button>

      {showNewCategory && (
        <div className="space-y-3 mt-3 p-3 border rounded-lg bg-gray-50">
          <div>
            <Label>Nome da nova categoria</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateCategory();
                }
                if (e.key === 'Escape') {
                  resetForm();
                }
              }}
              autoFocus
            />
          </div>

          <div>
            <Label>Cor da categoria</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    newCategoryColor === colorOption 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setNewCategoryColor(colorOption)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={handleCreateCategory}
              disabled={isCreating || !newCategoryName.trim()}
              size="sm"
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={resetForm}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
