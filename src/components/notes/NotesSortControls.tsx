
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface NotesSortControlsProps {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export function NotesSortControls({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: NotesSortControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Ordenar por:</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Data de criação</SelectItem>
            <SelectItem value="updated_at">Última atualização</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="category">Categoria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-2"
      >
        {sortOrder === 'asc' ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
        {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
      </Button>
    </div>
  );
}
