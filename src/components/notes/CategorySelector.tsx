
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ id: string; name: string; color: string }>;
}

export function CategorySelector({ 
  selectedCategory, 
  onCategoryChange, 
  categories 
}: CategorySelectorProps) {
  const validCategories = categories.filter(category => 
    category.name && category.name.trim() !== ''
  );

  return (
    <div>
      <Label htmlFor="category">Categoria</Label>
      {validCategories.length === 0 ? (
        <div className="flex h-10 w-full items-center rounded-md border border-input bg-gray-50 px-3 py-2 text-sm text-muted-foreground">
          Nenhuma categoria disponível
        </div>
      ) : (
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {validCategories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                <div className="flex items-center gap-2 w-full">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
