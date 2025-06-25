
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Clock } from 'lucide-react';

export function UserApprovalLoader() {
  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto animate-smooth-fade-in">
      {/* Header Skeleton */}
      <Card className="shadow-lg border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded animate-pulse" />
            <div className="h-7 w-72 bg-orange-200 dark:bg-orange-800 rounded animate-pulse" />
          </div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="h-8 w-12 bg-orange-200 dark:bg-orange-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-20 bg-orange-200 dark:bg-orange-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Skeleton */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="h-6 w-48 bg-amber-200 dark:bg-amber-800 rounded animate-pulse" />
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3 bg-amber-50 dark:bg-amber-900/20">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-amber-200 dark:bg-amber-800 rounded animate-pulse" />
                </div>
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="h-8 w-20 bg-green-200 dark:bg-green-800 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-red-200 dark:bg-red-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
