
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/auth/page";
import TasksPage from "./pages/tasks/page";
import ModelsPage from "./pages/models/page";
import ModelsRegisterPage from "./pages/models/register/page";
import NotesPage from "./pages/notes/page";
import AdminPage from "./pages/admin/page";
import AdminUsersPage from "./pages/admin/users/page";
import AdminApprovedUsersPage from "./pages/admin/users/approved/page";
import AdminPendingUsersPage from "./pages/admin/users/pending/page";
import AdminReportsPage from "./pages/admin/reports/page";
import AdminAnalyticsPage from "./pages/admin/reports/analytics/page";
import AdminSettingsPage from "./pages/admin/settings/page";
import AdminSecuritySettingsPage from "./pages/admin/settings/security/page";
import ModelSchedulingPage from "./pages/models/scheduling/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="onlycat-theme">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
            {/* Rota principal - Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Autenticação */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Módulo de Tarefas */}
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/create" element={<TasksPage />} />
            <Route path="/tasks/todo" element={<TasksPage />} />
            <Route path="/tasks/in-progress" element={<TasksPage />} />
            <Route path="/tasks/completed" element={<TasksPage />} />
            
            {/* Módulo de Modelos */}
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/register" element={<ModelsRegisterPage />} />
            <Route path="/models/create" element={<ModelsPage />} />
            <Route path="/models/edit/:id" element={<ModelsPage />} />
            <Route path="/models/scheduling" element={<ModelSchedulingPage />} />
            <Route path="/models/scheduling/create" element={<ModelSchedulingPage />} />
            
            {/* Módulo de Notas */}
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/create" element={<NotesPage />} />
            <Route path="/notes/edit/:id" element={<NotesPage />} />
            
            {/* Painel Administrativo */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Gerenciamento de Usuários */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/approved" element={<AdminApprovedUsersPage />} />
            <Route path="/admin/users/pending" element={<AdminPendingUsersPage />} />
            
            {/* Relatórios e Analytics */}
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/reports/analytics" element={<AdminAnalyticsPage />} />
            
            {/* Configurações do Sistema */}
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/settings/security" element={<AdminSecuritySettingsPage />} />
            
            {/* Redirecionamentos e rotas não encontradas */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
