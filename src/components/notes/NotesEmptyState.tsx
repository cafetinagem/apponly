
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search } from 'lucide-react';

export function NotesEmptyState() {
  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gray-100 p-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Nenhuma nota encontrada
            </h3>
            <p className="text-gray-500 max-w-md">
              Você ainda não criou nenhuma nota ou nenhuma nota corresponde aos filtros aplicados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar primeira nota
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Limpar filtros
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>💡 Dica: Use categorias e tags para organizar melhor suas notas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
