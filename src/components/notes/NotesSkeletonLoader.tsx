
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface NotesSkeletonLoaderProps {
  count?: number;
}

export function NotesSkeletonLoader({ count = 6 }: NotesSkeletonLoaderProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
