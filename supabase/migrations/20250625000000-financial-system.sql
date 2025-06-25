-- Migration: Sistema de Gestão Financeira OnlyCat
-- Data: 2025-01-25
-- Descrição: Criação de tabelas para gestão financeira de modelos e vendas

-- 1. Tabela de Configurações Financeiras
CREATE TABLE public.financial_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  platform_name VARCHAR(50) NOT NULL, -- 'privacy', 'telegram', 'instagram', etc
  platform_percentage DECIMAL(5,2) NOT NULL DEFAULT 20.00, -- % da plataforma
  admin_percentage DECIMAL(5,2) NOT NULL DEFAULT 40.00, -- % do admin
  model_percentage DECIMAL(5,2) NOT NULL DEFAULT 40.00, -- % da modelo
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 2. Tabela de Vendas (registros manuais e automáticos)
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  sale_type VARCHAR(50) NOT NULL, -- 'chat', 'privacy', 'telegram', 'custom'
  gross_amount DECIMAL(10,2) NOT NULL, -- valor bruto da venda
  platform_fee DECIMAL(10,2) NOT NULL, -- taxa da plataforma
  admin_amount DECIMAL(10,2) NOT NULL, -- valor do admin
  model_amount DECIMAL(10,2) NOT NULL, -- valor da modelo
  net_amount DECIMAL(10,2) NOT NULL, -- valor líquido (gross - platform_fee)
  currency VARCHAR(3) DEFAULT 'BRL',
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  client_email VARCHAR(255),
  transaction_id VARCHAR(255), -- ID da transação da plataforma
  status VARCHAR(50) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
  source VARCHAR(50) DEFAULT 'manual', -- 'manual', 'email', 'api'
  email_reference TEXT, -- referência do email original
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 3. Tabela de Configurações de Chat/Vendas Personalizadas
CREATE TABLE public.chat_sales_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  service_name VARCHAR(100) NOT NULL, -- nome do serviço
  base_price DECIMAL(10,2) NOT NULL, -- preço base
  admin_percentage DECIMAL(5,2) NOT NULL, -- % configurável do admin
  model_percentage DECIMAL(5,2) NOT NULL, -- % da modelo
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 4. Tabela de Vendas de Chat
CREATE TABLE public.chat_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  config_id UUID REFERENCES chat_sales_config(id) ON DELETE SET NULL,
  service_name VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  admin_amount DECIMAL(10,2) NOT NULL,
  model_amount DECIMAL(10,2) NOT NULL,
  client_info JSONB, -- informações do cliente
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 5. Tabela de Configurações de Email
CREATE TABLE public.email_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- nome da integração
  email_provider VARCHAR(50) NOT NULL, -- 'gmail', 'outlook', 'yahoo'
  email_address VARCHAR(255) NOT NULL,
  imap_server VARCHAR(255),
  imap_port INTEGER,
  use_ssl BOOLEAN DEFAULT true,
  username VARCHAR(255),
  password_encrypted TEXT, -- senha criptografada
  keywords JSONB, -- palavras-chave para identificar vendas
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 60, -- minutos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 6. Tabela de Logs de Email (vendas identificadas)
CREATE TABLE public.email_sales_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID REFERENCES email_integrations(id) ON DELETE CASCADE,
  email_subject VARCHAR(500),
  email_from VARCHAR(255),
  email_date TIMESTAMP WITH TIME ZONE,
  email_body TEXT,
  extracted_amount DECIMAL(10,2),
  extracted_platform VARCHAR(50),
  extracted_client VARCHAR(255),
  processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'ignored', 'error'
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL, -- se foi convertido em venda
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- 7. Tabela de Relatórios Financeiros (cache de dados agregados)
CREATE TABLE public.financial_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- 'monthly', 'weekly', 'daily'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_admin_earnings DECIMAL(10,2) DEFAULT 0,
  total_model_earnings DECIMAL(10,2) DEFAULT 0,
  total_platform_fees DECIMAL(10,2) DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  top_platform VARCHAR(50),
  metrics JSONB, -- dados adicionais do relatório
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Índices para performance
CREATE INDEX idx_financial_settings_model_id ON financial_settings(model_id);
CREATE INDEX idx_sales_model_id ON sales(model_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_platform ON sales(platform);
CREATE INDEX idx_chat_sales_model_id ON chat_sales(model_id);
CREATE INDEX idx_chat_sales_date ON chat_sales(sale_date);
CREATE INDEX idx_email_logs_integration_id ON email_sales_logs(integration_id);
CREATE INDEX idx_email_logs_status ON email_sales_logs(processing_status);
CREATE INDEX idx_financial_reports_model_date ON financial_reports(model_id, period_start);

-- Enable RLS em todas as tabelas
ALTER TABLE public.financial_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sales_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sales_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (Row Level Security)
-- financial_settings
CREATE POLICY "Users can manage their financial settings" 
  ON public.financial_settings FOR ALL USING (auth.uid() = user_id);

-- sales
CREATE POLICY "Users can manage their sales" 
  ON public.sales FOR ALL USING (auth.uid() = user_id);

-- chat_sales_config
CREATE POLICY "Users can manage their chat sales config" 
  ON public.chat_sales_config FOR ALL USING (auth.uid() = user_id);

-- chat_sales
CREATE POLICY "Users can manage their chat sales" 
  ON public.chat_sales FOR ALL USING (auth.uid() = user_id);

-- email_integrations
CREATE POLICY "Users can manage their email integrations" 
  ON public.email_integrations FOR ALL USING (auth.uid() = user_id);

-- email_sales_logs
CREATE POLICY "Users can view their email sales logs" 
  ON public.email_sales_logs FOR ALL USING (auth.uid() = user_id);

-- financial_reports
CREATE POLICY "Users can view their financial reports" 
  ON public.financial_reports FOR ALL USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_settings_updated_at BEFORE UPDATE ON public.financial_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sales_config_updated_at BEFORE UPDATE ON public.chat_sales_config 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sales_updated_at BEFORE UPDATE ON public.chat_sales 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_integrations_updated_at BEFORE UPDATE ON public.email_integrations 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular divisão financeira automaticamente
CREATE OR REPLACE FUNCTION public.calculate_financial_split(
  p_model_id UUID,
  p_platform VARCHAR(50),
  p_gross_amount DECIMAL(10,2)
)
RETURNS TABLE(
  platform_fee DECIMAL(10,2),
  admin_amount DECIMAL(10,2),
  model_amount DECIMAL(10,2),
  net_amount DECIMAL(10,2)
) AS $$
DECLARE
  v_platform_percentage DECIMAL(5,2);
  v_admin_percentage DECIMAL(5,2);
  v_model_percentage DECIMAL(5,2);
  v_platform_fee DECIMAL(10,2);
  v_net_amount DECIMAL(10,2);
  v_admin_amount DECIMAL(10,2);
  v_model_amount DECIMAL(10,2);
BEGIN
  -- Buscar configurações financeiras
  SELECT 
    fs.platform_percentage,
    fs.admin_percentage,
    fs.model_percentage
  INTO 
    v_platform_percentage,
    v_admin_percentage,
    v_model_percentage
  FROM financial_settings fs
  WHERE fs.model_id = p_model_id 
    AND fs.platform_name = p_platform 
    AND fs.is_active = true
  LIMIT 1;
  
  -- Se não encontrou configuração, usar padrões
  IF NOT FOUND THEN
    v_platform_percentage := 20.00;
    v_admin_percentage := 40.00;
    v_model_percentage := 40.00;
  END IF;
  
  -- Calcular valores
  v_platform_fee := (p_gross_amount * v_platform_percentage / 100);
  v_net_amount := p_gross_amount - v_platform_fee;
  v_admin_amount := (v_net_amount * v_admin_percentage / 100);
  v_model_amount := (v_net_amount * v_model_percentage / 100);
  
  RETURN QUERY SELECT v_platform_fee, v_admin_amount, v_model_amount, v_net_amount;
END;
$$ LANGUAGE plpgsql; 