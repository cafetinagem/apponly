
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTaskGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTaskGrid({ children, className }: ResponsiveTaskGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        // Mobile: 1 column
        "grid-cols-1",
        // Tablet: 2 columns
        "sm:grid-cols-2",
        // Desktop: 3 columns
        "lg:grid-cols-3",
        // Large desktop: 4 columns
        "xl:grid-cols-4",
        // Auto-fit for very large screens
        "2xl:grid-cols-auto",
        // Ensure equal height cards
        "auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  );
}
