
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
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3
} from 'lucide-react';

interface AdminSectionProps {
  currentPath: string;
  onLinkClick: () => void;
}

export function AdminSection({ currentPath, onLinkClick }: AdminSectionProps) {
  const adminMenuItems = [
    {
      title: "Dashboard Admin",
      url: "/admin",
      icon: Shield,
      description: "Visão geral administrativa"
    },
    {
      title: "Usuários",
      url: "/admin/users",
      icon: Users,
      description: "Gerenciar usuários"
    },
    {
      title: "Relatórios",
      url: "/admin/reports",
      icon: BarChart3,
      description: "Relatórios do sistema"
    },
    {
      title: "Configurações",
      url: "/admin/settings",
      icon: Settings,
      description: "Configurações do sistema"
    }
  ];

  const isPathActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-400 font-bold text-sm uppercase tracking-wide">
        Admin
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-orange-400 hover:text-white",
                    isPathActive(item.url) && "bg-orange-500 text-white shadow-lg"
                  )}
                  title={item.description}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
