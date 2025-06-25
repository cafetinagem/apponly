import React from 'react';
import { SidebarContent } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSidebarState } from '@/hooks/useSidebarState';
import { DashboardSection } from './sections/DashboardSection';
import { TasksSection } from './sections/TasksSection';
import { ModelsSection } from './sections/ModelsSection';
import { AdminSection } from './sections/AdminSection';
import { AuthSection } from './sections/AuthSection';

export function SidebarMenuSection() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const {
    location,
    isTasksOpen,
    setIsTasksOpen,
    isModelsOpen,
    setIsModelsOpen,
    handleLinkClick
  } = useSidebarState();

  const isAdminUser = user?.email === 'onlycatbrasil@gmail.com' || isAdmin;

  return (
    <SidebarContent className="bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 p-4 space-y-2">
      <DashboardSection 
        currentPath={location.pathname} 
        onLinkClick={handleLinkClick} 
      />
      
      <TasksSection
        currentPath={location.pathname}
        isTasksOpen={isTasksOpen}
        setIsTasksOpen={setIsTasksOpen}
        onLinkClick={handleLinkClick}
      />
      
      <ModelsSection
        currentPath={location.pathname}
        isModelsOpen={isModelsOpen}
        setIsModelsOpen={setIsModelsOpen}
        onLinkClick={handleLinkClick}
      />
      
      {isAdminUser && (
        <AdminSection 
          currentPath={location.pathname} 
          onLinkClick={handleLinkClick} 
        />
      )}
      
      {!user && (
        <AuthSection 
          currentPath={location.pathname} 
          onLinkClick={handleLinkClick} 
        />
      )}
    </SidebarContent>
  );
}
