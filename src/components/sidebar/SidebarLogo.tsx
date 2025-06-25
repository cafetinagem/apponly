import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function SidebarLogo() {
  console.log('🎨 [SidebarLogo] Rendering logo with theme toggle');
  
  return (
    <SidebarHeader className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-3 p-6">
        {/* Logo OnlyCat - Design do Dashboard */}
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-transform duration-200">
          <span className="text-white font-bold text-sm">OC</span>
        </div>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            OnlyCat Brasil
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Sistema de Gestão
          </p>
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </SidebarHeader>
  );
}
