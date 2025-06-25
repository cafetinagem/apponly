
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  enableHorizontalScroll?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className,
  enableHorizontalScroll = false 
}: ResponsiveContainerProps) {
  return (
    <div 
      className={cn(
        "w-full",
        enableHorizontalScroll && "overflow-x-auto",
        className
      )}
    >
      <div className="min-w-full">
        {children}
      </div>
    </div>
  );
}

// Modal wrapper that prevents viewport overflow
interface ResponsiveModalProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveModal({ children, className }: ResponsiveModalProps) {
  return (
    <div 
      className={cn(
        "max-h-[90vh] max-w-[95vw] overflow-y-auto",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

// Card grid that adapts to different screen sizes
interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveCardGrid({ children, className }: ResponsiveCardGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "auto-rows-fr", // Ensures equal height cards
        className
      )}
    >
      {children}
    </div>
  );
}
