import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarFooter } from "@/components/ui/sidebar";

export function SidebarUserSection() {
  const { user, signOut } = useAuth();

  return (
    <SidebarFooter className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-orange-500 text-white">
            {user?.email?.charAt(0).toUpperCase() || 'OC'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user?.email || 'onlycatbrasil@gmail.com'}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-0 text-xs text-gray-500 dark:text-slate-400 hover:text-orange-500"
            onClick={signOut}
          >
            Sair
          </Button>
        </div>
      </div>
    </SidebarFooter>
  );
}
