
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  className = '',
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2 xs:gap-2 sm:gap-3',
    md: 'gap-3 xs:gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 xs:gap-4 sm:gap-6 md:gap-8'
  };

  const getGridClasses = () => {
    const classes = ['grid'];
    
    // XS (< 375px) - Very small phones
    classes.push(`grid-cols-${cols.xs || 1}`);
    
    // SM (640px+) - Large phones / small tablets
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    
    // MD (768px+) - Tablets
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    
    // LG (1024px+) - Small laptops
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    
    // XL (1280px+) - Desktops
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    // 2XL (1536px+) - Large desktops
    if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      getGridClasses(),
      gapClasses[gap],
      // Ensure proper sizing and overflow handling
      'auto-rows-max',
      'min-w-0 w-full',
      // Prevent grid blowout on very small screens (enhanced)
      'max-w-full',
      // Better spacing for very small screens
      'px-1 xs:px-0',
      // Smooth animations
      'transition-all duration-150 ease-in-out',
      className
    )}>
      {children}
    </div>
  );
}
