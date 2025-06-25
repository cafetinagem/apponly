
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryFilter } from './search/CategoryFilter';
import { TagFilter } from './search/TagFilter';
import { DateFilter } from './search/DateFilter';
import { AttachmentFilter } from './search/AttachmentFilter';
import { ActiveFilters } from './search/ActiveFilters';

interface SearchFilters {
  searchTerm: string;
  categories: string[];
  tags: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  hasAttachments: boolean | null;
  sortBy: 'date' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  tags: Array<{ id: string; name: string; color: string }>;
}

export function AdvancedSearch({ filters, onFiltersChange, categories, tags }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      categories: [],
      tags: [],
      dateRange: {},
      hasAttachments: null,
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setIsExpanded(false);
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.tags.length > 0 || 
                          filters.dateRange.from || 
                          filters.hasAttachments !== null;

  const activeFiltersCount = filters.categories.length + 
                            filters.tags.length + 
                            (filters.dateRange.from ? 1 : 0) + 
                            (filters.hasAttachments !== null ? 1 : 0);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar em título, conteúdo, categorias..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Button
          variant={isExpanded ? "default" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategories={filters.categories}
              onCategoriesChange={(categories) => updateFilters({ categories })}
            />

            <TagFilter
              tags={tags}
              selectedTags={filters.tags}
              onTagsChange={(tags) => updateFilters({ tags })}
            />

            <DateFilter
              dateRange={filters.dateRange}
              onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
              showDatePicker={showDatePicker}
              onShowDatePickerChange={setShowDatePicker}
            />

            <AttachmentFilter
              hasAttachments={filters.hasAttachments}
              onHasAttachmentsChange={(hasAttachments) => updateFilters({ hasAttachments })}
            />
          </div>

          <ActiveFilters
            filters={filters}
            onUpdateFilters={updateFilters}
          />
        </div>
      )}
    </Card>
  );
}
