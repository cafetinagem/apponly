
import { X, Calendar, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchFilters {
  categories: string[];
  tags: string[];
  dateRange: { from?: Date; to?: Date };
  hasAttachments: boolean | null;
}

interface ActiveFiltersProps {
  filters: SearchFilters;
  onUpdateFilters: (updates: Partial<SearchFilters>) => void;
}

export function ActiveFilters({ filters, onUpdateFilters }: ActiveFiltersProps) {
  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.tags.length > 0 || 
                          filters.dateRange.from || 
                          filters.hasAttachments !== null;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.categories.map(category => (
        <Badge key={category} variant="secondary" className="gap-1">
          {category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({ 
              categories: filters.categories.filter(c => c !== category) 
            })}
          />
        </Badge>
      ))}
      {filters.tags.map(tag => (
        <Badge key={tag} variant="secondary" className="gap-1">
          <TagIcon className="h-3 w-3" />
          {tag}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({ 
              tags: filters.tags.filter(t => t !== tag) 
            })}
          />
        </Badge>
      ))}
      {filters.dateRange.from && (
        <Badge variant="secondary" className="gap-1">
          <Calendar className="h-3 w-3" />
          {filters.dateRange.from.toLocaleDateString()}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({ dateRange: {} })}
          />
        </Badge>
      )}
      {filters.hasAttachments !== null && (
        <Badge variant="secondary" className="gap-1">
          {filters.hasAttachments ? "Com anexos" : "Sem anexos"}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onUpdateFilters({ hasAttachments: null })}
          />
        </Badge>
      )}
    </div>
  );
}
