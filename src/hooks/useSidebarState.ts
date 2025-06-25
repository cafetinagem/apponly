
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from "@/components/ui/sidebar";

export function useSidebarState() {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const [isTasksOpen, setIsTasksOpen] = useState(location.pathname.startsWith('/tasks'));
  const [isModelsOpen, setIsModelsOpen] = useState(location.pathname.startsWith('/models'));
  const [isAdminOpen, setIsAdminOpen] = useState(location.pathname.startsWith('/admin'));

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return {
    location,
    isTasksOpen,
    setIsTasksOpen,
    isModelsOpen,
    setIsModelsOpen,
    isAdminOpen,
    setIsAdminOpen,
    handleLinkClick
  };
}
