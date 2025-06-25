
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
  CheckSquare, 
  ChevronRight,
  CircleDot,
  Play,
  CheckCircle,
} from 'lucide-react';

interface TasksSectionProps {
  currentPath: string;
  isTasksOpen: boolean;
  setIsTasksOpen: (open: boolean) => void;
  onLinkClick: () => void;
}

export function TasksSection({ currentPath, isTasksOpen, setIsTasksOpen, onLinkClick }: TasksSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-400 font-bold text-sm uppercase tracking-wide">
        Tarefas
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible open={isTasksOpen} onOpenChange={setIsTasksOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className={cn(
                  "w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-orange-400 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-orange-500"
                )}>
                  <CheckSquare className="h-5 w-5" />
                  <span className="font-medium">Gerenciamento</span>
                  <ChevronRight className={cn(
                    "h-4 w-4 ml-auto transition-transform duration-200", 
                    isTasksOpen && "rotate-90"
                  )} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-4 border-l-2 border-orange-200/20 pl-4">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/tasks/todo"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/tasks/todo" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <CircleDot className="h-4 w-4" />
                      <span>A Fazer</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/tasks/in-progress"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/tasks/in-progress" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <Play className="h-4 w-4" />
                      <span>Em Execução</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link 
                      to="/tasks/completed"
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-orange-400 hover:text-white text-sm",
                        currentPath === "/tasks/completed" && "bg-orange-500 text-white shadow-lg"
                      )}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Finalizadas</span>
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
