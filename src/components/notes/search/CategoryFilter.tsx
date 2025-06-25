
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; color: string }>;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategoryFilter({ categories, selectedCategories, onCategoriesChange }: CategoryFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Categorias</label>
      <Select
        value={selectedCategories[0] || "all"}
        onValueChange={(value) => onCategoriesChange(value === "all" ? [] : [value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.name}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
