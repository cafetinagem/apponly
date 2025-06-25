
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Heart } from 'lucide-react';

interface NotesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  modelFilter: string;
  setModelFilter: (model: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  advancedFilters: any;
  setAdvancedFilters: (filters: any) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  models: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string; color: string }>;
  useAdvancedSearch?: boolean;
}

export function NotesFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  modelFilter,
  setModelFilter,
  showFavoritesOnly,
  setShowFavoritesOnly,
  advancedFilters,
  setAdvancedFilters,
  categories,
  models,
  useAdvancedSearch = false
}: NotesFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Busca principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, conteúdo ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por categoria */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Categoria</Label>
              <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
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

            {/* Filtro por modelo */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Modelo</Label>
              <Select value={modelFilter || "all"} onValueChange={(value) => setModelFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os modelos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por favoritos */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Favoritos</Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="favorites-filter"
                  checked={showFavoritesOnly}
                  onCheckedChange={setShowFavoritesOnly}
                />
                <Label htmlFor="favorites-filter" className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  Apenas favoritos
                </Label>
              </div>
            </div>

            {/* Filtros avançados */}
            {useAdvancedSearch && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Filtros Avançados
                </Label>
                <Select 
                  value={`${advancedFilters.sortBy}-${advancedFilters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    setAdvancedFilters({ ...advancedFilters, sortBy, sortOrder });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Mais recentes</SelectItem>
                    <SelectItem value="created_at-asc">Mais antigas</SelectItem>
                    <SelectItem value="updated_at-desc">Atualizadas recentemente</SelectItem>
                    <SelectItem value="title-asc">Título A-Z</SelectItem>
                    <SelectItem value="title-desc">Título Z-A</SelectItem>
                    <SelectItem value="category-asc">Categoria A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
