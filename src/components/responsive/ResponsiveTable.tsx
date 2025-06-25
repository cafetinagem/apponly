
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

export function ResponsiveTable({ 
  children, 
  className = '',
  minWidth = '600px'
}: ResponsiveTableProps) {
  return (
    <div className={cn(
      'w-full overflow-x-auto mobile-scroll',
      // Prevent horizontal page overflow on all devices - enhanced for very small screens
      'max-w-[calc(100vw-1rem)] xs:max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-3rem)]',
      // Modern scrollbar styling with theme support
      'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
      'dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800',
      // Mobile-friendly borders and radius with better shadows
      'rounded-lg border border-border elevated-shadow',
      // Smooth transitions
      'transition-all duration-150 ease-in-out',
      className
    )}>
      <div 
        className="lg:min-w-full transition-all duration-150 ease-in-out"
        style={{ minWidth }}
      >
        {children}
      </div>
    </div>
  );
}
