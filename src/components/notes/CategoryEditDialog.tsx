
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CategoryEditDialogProps {
  open: boolean;
  onClose: () => void;
  category: { id: string; name: string; color: string } | null;
  onUpdateCategory: (categoryId: string, updates: { name?: string; color?: string }) => Promise<any>;
}

const colorOptions = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function CategoryEditDialog({ 
  open, 
  onClose, 
  category, 
  onUpdateCategory 
}: CategoryEditDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Update state when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateCategory(category.id, {
        name: name.trim(),
        color
      });
      
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!"
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da categoria"
              autoFocus
            />
          </div>

          <div>
            <Label>Cor da Categoria</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">Selecionada:</span>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-mono">{color}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isUpdating || !name.trim()}
              className="flex-1"
            >
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
