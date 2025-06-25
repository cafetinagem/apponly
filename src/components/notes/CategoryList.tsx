
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CategoryEditDialog } from './CategoryEditDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CategoryListProps {
  categories: Array<{ id: string; name: string; color: string }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => Promise<any>;
  onUpdateCategory?: (categoryId: string, updates: { name?: string; color?: string }) => Promise<any>;
}

export function CategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
  onDeleteCategory,
  onUpdateCategory
}: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const validCategories = categories.filter(category => 
    category.name && category.name.trim() !== ''
  );

  const handleDeleteCategory = async () => {
    if (!onDeleteCategory || !deleteConfirmCategory) return;
    
    try {
      await onDeleteCategory(deleteConfirmCategory.id);
      // Se a categoria deletada estava selecionada, limpar seleção
      if (selectedCategory === deleteConfirmCategory.name) {
        onCategoryChange('');
      }
      toast({
        title: "Sucesso",
        description: "Categoria removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover categoria.",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmCategory(null);
    }
  };

  if (validCategories.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <Label className="text-sm font-medium">Categorias existentes:</Label>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {validCategories.map(category => (
          <div key={category.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm">{category.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {onUpdateCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDeleteCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmCategory({ id: category.id, name: category.name })}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {onUpdateCategory && (
        <CategoryEditDialog
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          onUpdateCategory={onUpdateCategory}
        />
      )}

      <AlertDialog open={!!deleteConfirmCategory} onOpenChange={() => setDeleteConfirmCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{deleteConfirmCategory?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmCategory(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
