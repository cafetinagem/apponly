import { Sidebar } from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
import { SidebarUserSection } from "./sidebar/SidebarUserSection";

export function AppSidebar() {
  console.log('📱 [AppSidebar] Rendering sidebar');
  
  return (
    <Sidebar 
      variant="inset" 
      className="bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-sm"
    >
      <SidebarLogo />
      <SidebarMenuSection />
      <SidebarUserSection />
    </Sidebar>
  );
}
