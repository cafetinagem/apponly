
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, 
  ChevronRight,
  UserPlus,
  Calendar,
} from 'lucide-react';

interface ModelsSectionProps {
  currentPath: string;
  isModelsOpen: boolean;
  setIsModelsOpen: (open: boolean) => void;
  onLinkClick: () => void;
}

export function ModelsSection({ currentPath, isModelsOpen, setIsModelsOpen, onLinkClick }: ModelsSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-400 font-bold text-sm uppercase tracking-wide">
        Modelos
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible open={isModelsOpen} onOpenChange={setIsModelsOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className={cn(
                  "w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-orange-400 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-orange-500"
                )}>
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Gerenciamento</span>
                  <ChevronRight className={cn(
                    "h-4 w-4 ml-auto transition-transform duration-200", 
                    isModelsOpen && "rotate-90"
                  )} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-4 border-l-2 border-orange-200/20 pl-4">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/models"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/models" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      <span>Lista</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/models/register"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/models/register" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Cadastro</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/models/scheduling"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/models/scheduling" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Agendamento</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
