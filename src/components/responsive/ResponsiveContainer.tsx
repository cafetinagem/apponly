
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const ResponsiveContainer = ({ 
  children, 
  className,
  maxWidth = 'full'
}: ResponsiveContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md', 
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      // Base responsive container
      "w-full min-h-0",
      // Mobile-first padding with proper touch targets
      "px-3 sm:px-4 md:px-6 lg:px-8",
      "py-3 sm:py-4 md:py-6",
      // Prevent horizontal overflow on all devices
      "overflow-x-hidden",
      // Ensure proper stacking and positioning
      "relative",
      // Max width constraint
      maxWidthClasses[maxWidth],
      "mx-auto",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}: { 
  children: React.ReactNode; 
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}) => {
  const getGridClasses = () => {
    const classes = ['grid', 'gap-3 sm:gap-4 md:gap-6'];
    
    // XS (< 640px) - phones
    if (cols.xs === 1) classes.push('grid-cols-1');
    if (cols.xs === 2) classes.push('grid-cols-2');
    
    // SM (640px+) - large phones
    if (cols.sm === 1) classes.push('sm:grid-cols-1');
    if (cols.sm === 2) classes.push('sm:grid-cols-2');
    if (cols.sm === 3) classes.push('sm:grid-cols-3');
    
    // MD (768px+) - tablets
    if (cols.md === 1) classes.push('md:grid-cols-1');
    if (cols.md === 2) classes.push('md:grid-cols-2');
    if (cols.md === 3) classes.push('md:grid-cols-3');
    if (cols.md === 4) classes.push('md:grid-cols-4');
    
    // LG (1024px+) - laptops
    if (cols.lg === 1) classes.push('lg:grid-cols-1');
    if (cols.lg === 2) classes.push('lg:grid-cols-2');
    if (cols.lg === 3) classes.push('lg:grid-cols-3');
    if (cols.lg === 4) classes.push('lg:grid-cols-4');
    
    // XL (1280px+) - desktops
    if (cols.xl === 1) classes.push('xl:grid-cols-1');
    if (cols.xl === 2) classes.push('xl:grid-cols-2');
    if (cols.xl === 3) classes.push('xl:grid-cols-3');
    if (cols.xl === 4) classes.push('xl:grid-cols-4');
    if (cols.xl === 5) classes.push('xl:grid-cols-5');
    if (cols.xl === 6) classes.push('xl:grid-cols-6');
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      getGridClasses(),
      // Ensure items don't break on small screens
      "auto-rows-max",
      // Prevent grid blowout
      "min-w-0",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveTable = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <div className={cn(
      // Table container with controlled overflow
      "w-full overflow-x-auto",
      // Prevent horizontal page scroll
      "max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)]",
      // Scrollbar styling
      "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800",
      // Mobile improvements
      "rounded-lg border",
      // Ensure table doesn't break layout
      "min-w-0",
      className
    )}>
      <div className="min-w-[600px] lg:min-w-full">
        {children}
      </div>
    </div>
  );
};

export const ResponsiveStack = ({ 
  children, 
  className,
  spacing = "default"
}: { 
  children: React.ReactNode; 
  className?: string;
  spacing?: "tight" | "default" | "loose";
}) => {
  const spacingClasses = {
    tight: "space-y-2 sm:space-y-3",
    default: "space-y-3 sm:space-y-4 md:space-y-6",
    loose: "space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10"
  };

  return (
    <div className={cn(
      "flex flex-col w-full",
      // Prevent items from breaking out
      "min-w-0",
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};
