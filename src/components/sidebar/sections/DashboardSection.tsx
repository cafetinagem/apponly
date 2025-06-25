import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText } from 'lucide-react';

interface DashboardSectionProps {
  currentPath: string;
  onLinkClick: () => void;
}

export function DashboardSection({ currentPath, onLinkClick }: DashboardSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-4">
        Dashboard
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link 
                to="/"
                onClick={onLinkClick}
                className={cn(
                  "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 hover:scale-105",
                  currentPath === "/" 
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg" 
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Início</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link 
                to="/notes"
                onClick={onLinkClick}
                className={cn(
                  "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 hover:scale-105",
                  currentPath === "/notes" 
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg" 
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                )}
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">Notas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
