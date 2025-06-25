import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Search, Bell, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  console.log('🏗️ [MainLayout] Rendering with children');
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1 w-full min-w-0">
          {/* Header - Design do Dashboard */}
          <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    OnlyCat Command Center
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sistema de gestão profissional
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 hover:scale-105 transition-all duration-200 border-gray-300 dark:border-slate-600"
                >
                  <Search size={16} />
                  Buscar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:scale-105 transition-all duration-200 relative border-gray-300 dark:border-slate-600"
                >
                  <Bell size={16} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleTheme} 
                  className="hover:scale-105 transition-all duration-200 border-gray-300 dark:border-slate-600"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
                
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                  <Plus size={16} />
                  Ação Rápida
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content com background #F3F5F7 */}
          <main 
            className="p-6 space-y-6 min-h-[calc(100vh-88px)]" 
            style={{backgroundColor: theme === 'dark' ? '#1e293b' : '#F3F5F7'}}
          >
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
