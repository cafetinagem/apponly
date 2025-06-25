
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-orange-100 dark:bg-orange-900/20",
        className
      )}
      {...props}
    />
  );
}

export function TaskSkeleton() {
  return (
    <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-3/4 bg-orange-100 dark:bg-orange-900/30" />
        <Skeleton className="h-6 w-16 bg-orange-200 dark:bg-orange-800/50" />
      </div>
      <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800" />
      <Skeleton className="h-4 w-2/3 bg-gray-100 dark:bg-gray-800" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-20 bg-orange-100 dark:bg-orange-900/30" />
        <Skeleton className="h-8 w-20 bg-gray-100 dark:bg-gray-800" />
        <Skeleton className="h-8 w-20 bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-8 w-64 bg-orange-200 dark:bg-orange-800/50" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-2 bg-white dark:bg-gray-900 shadow-sm">
            <Skeleton className="h-4 w-20 bg-gray-100 dark:bg-gray-800" />
            <Skeleton className="h-8 w-12 bg-orange-200 dark:bg-orange-800/50" />
          </div>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-900 shadow-sm">
            <Skeleton className="h-5 w-32 bg-orange-200 dark:bg-orange-800/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserApprovalSkeleton() {
  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-white dark:bg-gray-900">
        <Skeleton className="h-8 w-80 mb-2 bg-orange-200 dark:bg-orange-800/50" />
        <Skeleton className="h-4 w-96 mb-4 bg-gray-100 dark:bg-gray-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-orange-100 dark:bg-orange-900/20" />
          ))}
        </div>
      </div>
      
      <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-white dark:bg-gray-900">
        <Skeleton className="h-6 w-60 mb-4 bg-amber-200 dark:bg-amber-800/50" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
              <Skeleton className="h-5 w-3/4 bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-4 w-full bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-3 w-32 bg-gray-100 dark:bg-gray-800" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 bg-green-100 dark:bg-green-900/20" />
                <Skeleton className="h-8 w-20 bg-red-100 dark:bg-red-900/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResponsiveSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-48 bg-orange-200 dark:bg-orange-800/50" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border border-orange-200 dark:border-orange-800 rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-full bg-orange-100 dark:bg-orange-900/20" />
              <Skeleton className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-12 bg-orange-100 dark:bg-orange-900/20" />
                <Skeleton className="h-6 w-16 bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return <DashboardSkeleton />;
}
