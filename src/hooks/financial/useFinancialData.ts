import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sale, 
  ChatSale, 
  FinancialSettings, 
  ChatSalesConfig,
  FinancialDashboardData,
  SalesFilters,
  ChatSalesFilters,
  CreateSaleForm,
  CreateChatSaleForm,
  FinancialSplit
} from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export function useFinancialData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [chatSales, setChatSales] = useState<ChatSale[]>([]);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings[]>([]);
  const [chatSalesConfigs, setChatSalesConfigs] = useState<ChatSalesConfig[]>([]);
  const [dashboardData, setDashboardData] = useState<FinancialDashboardData | null>(null);
  const [models, setModels] = useState<any[]>([]);

  // ===== SALES MANAGEMENT =====
  const loadSales = useCallback(async (filters?: SalesFilters) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('sales')
        .select(`
          *,
          models:model_id (
            id,
            name,
            artistic_name
          )
        `)
        .eq('user_id', user.id)
        .order('sale_date', { ascending: false });

      // Aplicar filtros
      if (filters?.model_id) {
        query = query.eq('model_id', filters.model_id);
      }
      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters?.sale_type) {
        query = query.eq('sale_type', filters.sale_type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.date_from) {
        query = query.gte('sale_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('sale_date', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createSale = useCallback(async (saleData: CreateSaleForm): Promise<Sale | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Calcular divisão financeira
      const split = await calculateFinancialSplit(
        saleData.model_id, 
        saleData.platform, 
        saleData.gross_amount
      );

      if (!split) throw new Error('Erro ao calcular divisão financeira');

      const newSale = {
        ...saleData,
        platform_fee: split.platform_fee,
        admin_amount: split.admin_amount,
        model_amount: split.model_amount,
        net_amount: split.net_amount,
        currency: 'BRL',
        status: 'confirmed' as const,
        source: 'manual' as const,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso",
      });

      // Recarregar dados
      loadSales();
      loadDashboardData();

      return data;
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a venda",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, loadSales]);

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso",
      });

      loadSales();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a venda",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadSales]);

  const deleteSale = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda removida com sucesso",
      });

      loadSales();
      loadDashboardData();
      return true;
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a venda",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadSales]);

  // ===== CHAT SALES MANAGEMENT =====
  const loadChatSales = useCallback(async (filters?: ChatSalesFilters) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('chat_sales')
        .select(`
          *,
          models:model_id (
            id,
            name,
            artistic_name
          ),
          chat_sales_config:config_id (
            id,
            service_name,
            base_price
          )
        `)
        .eq('user_id', user.id)
        .order('sale_date', { ascending: false });

      // Aplicar filtros
      if (filters?.model_id) {
        query = query.eq('model_id', filters.model_id);
      }
      if (filters?.service_name) {
        query = query.eq('service_name', filters.service_name);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.date_from) {
        query = query.gte('sale_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('sale_date', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;
      setChatSales(data || []);
    } catch (error) {
      console.error('Erro ao carregar vendas de chat:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas de chat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createChatSale = useCallback(async (chatSaleData: CreateChatSaleForm): Promise<ChatSale | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Buscar configuração para calcular percentuais
      const { data: config } = await supabase
        .from('chat_sales_config')
        .select('*')
        .eq('model_id', chatSaleData.model_id)
        .eq('service_name', chatSaleData.service_name)
        .eq('is_active', true)
        .single();

      let adminPercentage = 50; // padrão
      let modelPercentage = 50; // padrão

      if (config) {
        adminPercentage = config.admin_percentage;
        modelPercentage = config.model_percentage;
      }

      const totalAmount = chatSaleData.quantity * chatSaleData.unit_price;
      const adminAmount = (totalAmount * adminPercentage) / 100;
      const modelAmount = (totalAmount * modelPercentage) / 100;

      const newChatSale = {
        ...chatSaleData,
        config_id: config?.id,
        total_amount: totalAmount,
        admin_amount: adminAmount,
        model_amount: modelAmount,
        status: 'confirmed' as const,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('chat_sales')
        .insert([newChatSale])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda de chat registrada com sucesso",
      });

      loadChatSales();
      loadDashboardData();

      return data;
    } catch (error) {
      console.error('Erro ao criar venda de chat:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a venda de chat",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, loadChatSales]);

  // ===== FINANCIAL SETTINGS =====
  const loadFinancialSettings = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_settings')
        .select(`
          *,
          models:model_id (
            id,
            name,
            artistic_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFinancialSettings(data || []);
    } catch (error) {
      console.error('Erro ao carregar configurações financeiras:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações financeiras",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ===== CHAT SALES CONFIG =====
  const loadChatSalesConfigs = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sales_config')
        .select(`
          *,
          models:model_id (
            id,
            name,
            artistic_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChatSalesConfigs(data || []);
    } catch (error) {
      console.error('Erro ao carregar configurações de vendas de chat:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de chat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ===== DASHBOARD DATA =====
  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Carregar estatísticas gerais
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'confirmed');

      if (salesError) throw salesError;

      const { data: chatSalesData, error: chatSalesError } = await supabase
        .from('chat_sales')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'confirmed');

      if (chatSalesError) throw chatSalesError;

      // Calcular métricas
      const allSales = salesData || [];
      const allChatSales = chatSalesData || [];

      const totalRevenue = allSales.reduce((sum, sale) => sum + sale.gross_amount, 0) +
                          allChatSales.reduce((sum, sale) => sum + sale.total_amount, 0);

      const adminEarnings = allSales.reduce((sum, sale) => sum + sale.admin_amount, 0) +
                           allChatSales.reduce((sum, sale) => sum + sale.admin_amount, 0);

      const modelEarnings = allSales.reduce((sum, sale) => sum + sale.model_amount, 0) +
                           allChatSales.reduce((sum, sale) => sum + sale.model_amount, 0);

      const platformFees = allSales.reduce((sum, sale) => sum + sale.platform_fee, 0);

      const salesCount = allSales.length + allChatSales.length;

      // Dados do dashboard
      const dashboard: FinancialDashboardData = {
        totalRevenue,
        adminEarnings,
        modelEarnings,
        platformFees,
        salesCount,
        topModel: {
          id: '',
          name: 'Calculando...',
          earnings: 0
        },
        topPlatform: {
          name: 'Privacy',
          revenue: 0
        },
        recentSales: allSales.slice(0, 5),
        monthlyTrend: [],
        platformDistribution: []
      };

      setDashboardData(dashboard);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ===== UTILITY FUNCTIONS =====
  const calculateFinancialSplit = useCallback(async (
    modelId: string, 
    platform: string, 
    grossAmount: number
  ): Promise<FinancialSplit | null> => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_financial_split', {
          p_model_id: modelId,
          p_platform: platform,
          p_gross_amount: grossAmount
        });

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao calcular divisão financeira:', error);
      return null;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadSales();
      loadChatSales();
      loadFinancialSettings();
      loadChatSalesConfigs();
      loadDashboardData();
    }
  }, [user, loadSales, loadChatSales, loadFinancialSettings, loadChatSalesConfigs, loadDashboardData]);

  // Load models data
  const loadModels = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    }
  }, [user]);

  // Chat Sales Config functions
  const createChatSalesConfig = useCallback(async (configData: any): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_sales_config')
        .insert([{ ...configData, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração de serviço criada com sucesso",
      });

      loadChatSalesConfigs();
      return true;
    } catch (error) {
      console.error('Erro ao criar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a configuração",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadChatSalesConfigs]);

  const updateChatSalesConfig = useCallback(async (id: string, updates: any): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_sales_config')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso",
      });

      loadChatSalesConfigs();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a configuração",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadChatSalesConfigs]);

  const updateChatSale = useCallback(async (id: string, updates: any): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_sales')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda de chat atualizada com sucesso",
      });

      loadChatSales();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar venda de chat:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a venda",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadChatSales]);

  // Load initial data including models
  useEffect(() => {
    if (user) {
      loadSales();
      loadChatSales();
      loadFinancialSettings();
      loadChatSalesConfigs();
      loadDashboardData();
      loadModels();
    }
  }, [user, loadSales, loadChatSales, loadFinancialSettings, loadChatSalesConfigs, loadDashboardData, loadModels]);

  return {
    // State
    loading,
    sales,
    chatSales,
    financialSettings,
    chatSalesConfigs,
    dashboardData,
    models,

    // Sales functions
    loadSales,
    createSale,
    updateSale,
    deleteSale,

    // Chat sales functions
    loadChatSales,
    createChatSale,
    updateChatSale,

    // Config functions
    loadFinancialSettings,
    loadChatSalesConfigs,
    createChatSalesConfig,
    updateChatSalesConfig,

    // Dashboard functions
    loadDashboardData,

    // Utility functions
    calculateFinancialSplit,

    // Refresh all data
    refreshAll: useCallback(() => {
      loadSales();
      loadChatSales();
      loadFinancialSettings();
      loadChatSalesConfigs();
      loadDashboardData();
      loadModels();
    }, [loadSales, loadChatSales, loadFinancialSettings, loadChatSalesConfigs, loadDashboardData, loadModels])
  };
} 