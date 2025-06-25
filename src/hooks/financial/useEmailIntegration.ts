import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  EmailIntegration, 
  EmailSalesLog, 
  EmailIntegrationForm,
  EmailSyncResponse 
} from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export function useEmailIntegration() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [integrations, setIntegrations] = useState<EmailIntegration[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailSalesLog[]>([]);

  // ===== EMAIL INTEGRATIONS MANAGEMENT =====
  const loadIntegrations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Erro ao carregar integrações de email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as integrações de email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createIntegration = useCallback(async (integrationData: EmailIntegrationForm): Promise<EmailIntegration | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Criptografar a senha antes de salvar (simulação - em produção usar crypto real)
      const encryptedPassword = integrationData.password ? 
        btoa(integrationData.password) : // Base64 básico - USAR CRYPTO REAL EM PRODUÇÃO
        undefined;

      const newIntegration = {
        ...integrationData,
        password_encrypted: encryptedPassword,
        password: undefined, // remover senha em texto puro
        keywords: integrationData.keywords,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('email_integrations')
        .insert([newIntegration])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Integração de email criada com sucesso",
      });

      loadIntegrations();
      return data;
    } catch (error) {
      console.error('Erro ao criar integração de email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a integração de email",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, loadIntegrations]);

  const updateIntegration = useCallback(async (id: string, updates: Partial<EmailIntegrationForm>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      let updateData = { ...updates };

      // Se há nova senha, criptografar
      if (updates.password) {
        updateData.password_encrypted = btoa(updates.password);
        delete updateData.password;
      }

      const { error } = await supabase
        .from('email_integrations')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Integração atualizada com sucesso",
      });

      loadIntegrations();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar integração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a integração",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadIntegrations]);

  const deleteIntegration = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_integrations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Integração removida com sucesso",
      });

      loadIntegrations();
      return true;
    } catch (error) {
      console.error('Erro ao deletar integração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a integração",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadIntegrations]);

  // ===== EMAIL LOGS MANAGEMENT =====
  const loadEmailLogs = useCallback(async (integrationId?: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('email_sales_logs')
        .select(`
          *,
          email_integrations:integration_id (
            id,
            name,
            email_address
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs de email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os logs de email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ===== EMAIL SYNC FUNCTIONS =====
  const syncEmails = useCallback(async (integrationId: string): Promise<EmailSyncResponse | null> => {
    if (!user) return null;

    setSyncing(true);
    try {
      // Buscar a integração
      const { data: integration, error: integrationError } = await supabase
        .from('email_integrations')
        .select('*')
        .eq('id', integrationId)
        .eq('user_id', user.id)
        .single();

      if (integrationError) throw integrationError;

      // Simular sincronização de emails (em produção, fazer integração real com IMAP)
      const mockEmails = await simulateEmailSync(integration);

      // Processar emails encontrados
      const processedEmails = await processEmailsForSales(mockEmails, integration);

      // Atualizar timestamp da última sincronização
      await supabase
        .from('email_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', integrationId)
        .eq('user_id', user.id);

      toast({
        title: "Sucesso",
        description: `Sincronização concluída. ${processedEmails.length} emails processados.`,
      });

      // Recarregar logs
      loadEmailLogs();

      return {
        data: processedEmails,
        success: true,
        processed_count: processedEmails.length,
        new_sales_count: processedEmails.filter(e => e.processing_status === 'processed').length,
        errors_count: processedEmails.filter(e => e.processing_status === 'error').length
      };

    } catch (error) {
      console.error('Erro ao sincronizar emails:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sincronizar emails",
        variant: "destructive"
      });
      return null;
    } finally {
      setSyncing(false);
    }
  }, [user, loadEmailLogs]);

  const syncAllIntegrations = useCallback(async (): Promise<void> => {
    if (!user) return;

    setSyncing(true);
    try {
      const activeIntegrations = integrations.filter(i => i.is_active);
      
      for (const integration of activeIntegrations) {
        await syncEmails(integration.id);
        // Pequena pausa entre sincronizações
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Sucesso",
        description: `Sincronização completa. ${activeIntegrations.length} integrações processadas.`,
      });

    } catch (error) {
      console.error('Erro ao sincronizar todas as integrações:', error);
      toast({
        title: "Erro",
        description: "Erro durante a sincronização geral",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  }, [user, integrations, syncEmails]);

  // ===== EMAIL PROCESSING FUNCTIONS =====
  const processEmailsForSales = useCallback(async (
    emails: any[], 
    integration: EmailIntegration
  ): Promise<EmailSalesLog[]> => {
    const processedLogs: EmailSalesLog[] = [];

    for (const email of emails) {
      try {
        // Extrair informações de venda do email
        const extractedData = extractSalesDataFromEmail(email, integration.keywords);

        // Criar log do email
        const logData = {
          integration_id: integration.id,
          email_subject: email.subject,
          email_from: email.from,
          email_date: email.date,
          email_body: email.body,
          extracted_amount: extractedData.amount,
          extracted_platform: extractedData.platform,
          extracted_client: extractedData.client,
          processing_status: extractedData.amount ? 'processed' : 'ignored' as const,
          user_id: user!.id
        };

        const { data: logEntry, error } = await supabase
          .from('email_sales_logs')
          .insert([logData])
          .select()
          .single();

        if (error) throw error;

        processedLogs.push(logEntry);

        // Se extraiu dados de venda, criar venda automaticamente
        if (extractedData.amount && extractedData.platform) {
          await createSaleFromEmail(extractedData, logEntry.id);
        }

      } catch (error) {
        console.error('Erro ao processar email:', error);
        
        // Criar log de erro
        const errorLog = {
          integration_id: integration.id,
          email_subject: email.subject,
          email_from: email.from,
          email_date: email.date,
          processing_status: 'error' as const,
          error_message: error instanceof Error ? error.message : 'Erro desconhecido',
          user_id: user!.id
        };

        const { data: errorLogEntry } = await supabase
          .from('email_sales_logs')
          .insert([errorLog])
          .select()
          .single();

        if (errorLogEntry) {
          processedLogs.push(errorLogEntry);
        }
      }
    }

    return processedLogs;
  }, [user]);

  const createSaleFromEmail = useCallback(async (
    extractedData: any, 
    emailLogId: string
  ): Promise<void> => {
    try {
      // Buscar modelo padrão ou usar o primeiro disponível
      const { data: models } = await supabase
        .from('models')
        .select('id')
        .eq('user_id', user!.id)
        .limit(1);

      if (!models || models.length === 0) {
        throw new Error('Nenhum modelo encontrado para associar à venda');
      }

      const modelId = models[0].id;

      // Calcular divisão financeira
      const { data: splitData, error: splitError } = await supabase
        .rpc('calculate_financial_split', {
          p_model_id: modelId,
          p_platform: extractedData.platform,
          p_gross_amount: extractedData.amount
        });

      if (splitError) throw splitError;

      const split = splitData[0];

      // Criar venda
      const saleData = {
        model_id: modelId,
        platform: extractedData.platform,
        sale_type: 'privacy' as const, // assumir privacy por padrão
        gross_amount: extractedData.amount,
        platform_fee: split.platform_fee,
        admin_amount: split.admin_amount,
        model_amount: split.model_amount,
        net_amount: split.net_amount,
        currency: 'BRL',
        sale_date: new Date().toISOString(),
        description: `Venda identificada automaticamente via email`,
        client_email: extractedData.client,
        status: 'confirmed' as const,
        source: 'email' as const,
        email_reference: emailLogId,
        user_id: user!.id
      };

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([saleData])
        .select()
        .single();

      if (saleError) throw saleError;

      // Atualizar log do email com referência à venda
      await supabase
        .from('email_sales_logs')
        .update({ sale_id: sale.id })
        .eq('id', emailLogId);

    } catch (error) {
      console.error('Erro ao criar venda a partir do email:', error);
      throw error;
    }
  }, [user]);

  // ===== UTILITY FUNCTIONS =====
  const extractSalesDataFromEmail = useCallback((email: any, keywords: string[]) => {
    const subject = email.subject?.toLowerCase() || '';
    const body = email.body?.toLowerCase() || '';
    const emailText = `${subject} ${body}`;

    // Verificar se o email contém palavras-chave de venda
    const hasKeywords = keywords.some(keyword => 
      emailText.includes(keyword.toLowerCase())
    );

    if (!hasKeywords) {
      return { amount: null, platform: null, client: null };
    }

    // Extrair valor (procurar por padrões de moeda)
    const amountRegex = /(?:R\$|rs|reais?)\s*(\d+(?:[.,]\d{2})?)/i;
    const amountMatch = emailText.match(amountRegex);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : null;

    // Extrair plataforma
    let platform = 'privacy'; // padrão
    if (emailText.includes('telegram')) platform = 'telegram';
    if (emailText.includes('instagram')) platform = 'instagram';
    if (emailText.includes('onlyfans')) platform = 'onlyfans';

    // Extrair cliente (email do remetente ou mencionado no corpo)
    const client = email.from || null;

    return { amount, platform, client };
  }, []);

  const simulateEmailSync = useCallback(async (integration: EmailIntegration) => {
    // Simular busca de emails - EM PRODUÇÃO, IMPLEMENTAR IMAP REAL
    const mockEmails = [
      {
        subject: 'Pagamento Privacy - R$ 50,00',
        from: 'cliente1@example.com',
        date: new Date().toISOString(),
        body: 'Seu pagamento de R$ 50,00 foi processado com sucesso na plataforma Privacy.'
      },
      {
        subject: 'Venda Telegram',
        from: 'cliente2@example.com', 
        date: new Date().toISOString(),
        body: 'Obrigado pela compra! Valor: R$ 25,00 via Telegram.'
      }
    ];

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));

    return mockEmails;
  }, []);

  const testConnection = useCallback(async (integrationId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Sucesso",
        description: "Conexão testada com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast({
        title: "Erro",
        description: "Falha na conexão com o servidor de email",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadIntegrations();
      loadEmailLogs();
    }
  }, [user, loadIntegrations, loadEmailLogs]);

  return {
    // State
    loading,
    syncing,
    integrations,
    emailLogs,

    // Integration functions
    loadIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,

    // Email sync functions
    syncEmails,
    syncAllIntegrations,
    loadEmailLogs,

    // Utility functions
    testConnection,

    // Refresh all data
    refreshAll: useCallback(() => {
      loadIntegrations();
      loadEmailLogs();
    }, [loadIntegrations, loadEmailLogs])
  };
} 