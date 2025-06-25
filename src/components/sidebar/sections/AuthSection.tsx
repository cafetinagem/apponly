
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
import { LogIn } from 'lucide-react';

interface AuthSectionProps {
  currentPath: string;
  onLinkClick: () => void;
}

export function AuthSection({ currentPath, onLinkClick }: AuthSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-400 font-bold text-sm uppercase tracking-wide">
        Autenticação
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link 
                to="/auth"
                onClick={onLinkClick}
                className={cn(
                  "flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-orange-400 hover:text-white",
                  currentPath === "/auth" && "bg-orange-500 text-white shadow-lg"
                )}
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Entrar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
