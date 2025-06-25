
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  // Configurações Gerais
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  systemName: string;
  timezone: string;
  
  // Segurança
  twoFactorRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  blockedIPs: string[];
  
  // Notificações
  emailOnApproval: boolean;
  emailOnRejection: boolean;
  emailAdminNotification: boolean;
  smtpServer: string;
  
  // Banco de Dados
  autoBackup: boolean;
  backupInterval: number;
  logRetentionDays: number;
  autoCleanup: boolean;
}

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  allowRegistrations: true,
  systemName: 'Sistema de Gestão',
  timezone: 'America/Sao_Paulo',
  twoFactorRequired: false,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  blockedIPs: [],
  emailOnApproval: true,
  emailOnRejection: false,
  emailAdminNotification: true,
  smtpServer: '',
  autoBackup: true,
  backupInterval: 24,
  logRetentionDays: 30,
  autoCleanup: true
};

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to load system settings from a dedicated approach
      // For now, we'll load from local storage to persist settings between sessions
      const savedSettings = localStorage.getItem('system_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
          console.log('✅ [SystemSettings] Configurações carregadas do localStorage');
        } catch (parseError) {
          console.warn('⚠️ [SystemSettings] Erro ao parsear configurações salvas, usando padrões');
          setSettings(DEFAULT_SETTINGS);
        }
      } else {
        console.log('✅ [SystemSettings] Usando configurações padrão');
        setSettings(DEFAULT_SETTINGS);
      }
      
    } catch (error) {
      console.error('❌ [SystemSettings] Erro inesperado:', error);
      setSettings(DEFAULT_SETTINGS);
      toast({
        title: "Erro ao carregar configurações",
        description: "Usando configurações padrão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveSettings = useCallback(async (newSettings: Partial<SystemSettings>) => {
    try {
      setLoading(true);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      // Save to localStorage for persistence
      localStorage.setItem('system_settings', JSON.stringify(updatedSettings));
      
      setSettings(updatedSettings);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
        variant: "default"
      });

      console.log('✅ [SystemSettings] Configurações salvas:', updatedSettings);
      
    } catch (error) {
      console.error('❌ [SystemSettings] Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [settings, toast]);

  const updateSetting = useCallback((key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    settings,
    loading,
    loadSettings,
    saveSettings,
    updateSetting
  };
}
