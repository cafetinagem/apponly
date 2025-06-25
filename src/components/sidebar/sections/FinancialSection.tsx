import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PieChart, 
  Settings, 
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from '@/hooks/useAuth';

interface FinancialSectionProps {
  currentPath: string;
  isFinancialOpen: boolean;
  setIsFinancialOpen: (open: boolean) => void;
  onLinkClick: () => void;
}

export function FinancialSection({ 
  currentPath, 
  isFinancialOpen, 
  setIsFinancialOpen, 
  onLinkClick 
}: FinancialSectionProps) {
  const { user } = useAuth();
  
  // Só mostrar se usuário estiver logado
  if (!user) return null;

  const financialItems = [
    {
      title: "Dashboard",
      url: "/financial/dashboard",
      icon: TrendingUp,
      description: "Visão geral das finanças"
    },
    {
      title: "Vendas",
      url: "/financial/sales",
      icon: DollarSign,
      description: "Gestão de vendas"
    },
    {
      title: "Vendas de Chat",
      url: "/financial/chat-sales",
      icon: CreditCard,
      description: "Vendas personalizadas"
    },
    {
      title: "Relatórios",
      url: "/financial/reports",
      icon: PieChart,
      description: "Relatórios financeiros"
    },
    {
      title: "Configurações",
      url: "/financial/settings",
      icon: Settings,
      description: "Configurar percentuais"
    },
    {
      title: "Email Simples ⚡",
      url: "/financial/simple-email",
      icon: Mail,
      description: "Configure email fácil (NOVO)"
    }
  ];

  const isFinancialActive = currentPath.startsWith('/financial');

  return (
    <SidebarGroup>
      <Collapsible 
        open={isFinancialOpen} 
        onOpenChange={setIsFinancialOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              className={`w-full justify-between hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20 transition-colors ${
                isFinancialActive ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Financeiro</span>
              </div>
              {isFinancialOpen ? (
                <ChevronDown className="h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>

        <CollapsibleContent className="space-y-1">
          <SidebarMenu>
            {financialItems.map((item) => {
              const isActive = currentPath === item.url;
              const Icon = item.icon;
              
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild
                    className={`pl-8 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20 transition-colors ${
                      isActive ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-r-2 border-orange-500' : ''
                    }`}
                  >
                    <Link 
                      to={item.url} 
                      onClick={onLinkClick}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
} 