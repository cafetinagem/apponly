
import { useState } from 'react';
import { CategorySelector } from './CategorySelector';
import { CategoryCreator } from './CategoryCreator';
import { CategoryList } from './CategoryList';

interface NoteCategoryManagerProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  onCreateCategory: (name: string, color?: string) => Promise<any>;
  onDeleteCategory?: (categoryId: string) => Promise<any>;
  onUpdateCategory?: (categoryId: string, updates: { name?: string; color?: string }) => Promise<any>;
}

export function NoteCategoryManager({ 
  selectedCategory, 
  onCategoryChange, 
  categories, 
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory
}: NoteCategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="flex gap-2">
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
        />
        <CategoryCreator
          categories={categories}
          onCreateCategory={onCreateCategory}
          onCategoryChange={onCategoryChange}
          isCreating={isCreating}
          onCreatingChange={setIsCreating}
        />
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
      />
    </div>
  );
}
