
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter, Clock } from 'lucide-react';

interface NotesPerformanceStatsProps {
  totalNotes: number;
  filteredNotes: number;
  currentPageNotes: number;
}

export function NotesPerformanceStats({ 
  totalNotes, 
  filteredNotes, 
  currentPageNotes 
}: NotesPerformanceStatsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total:</span>
              <Badge variant="outline">{totalNotes}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Filtradas:</span>
              <Badge variant="outline">{filteredNotes}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Exibindo:</span>
              <Badge variant="outline">{currentPageNotes}</Badge>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Sistema otimizado para performance
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
