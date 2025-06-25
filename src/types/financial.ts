// Types para Sistema de Gestão Financeira OnlyCat
export interface FinancialSettings {
  id: string;
  model_id: string;
  platform_name: string;
  platform_percentage: number;
  admin_percentage: number;
  model_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Sale {
  id: string;
  model_id: string;
  platform: string;
  sale_type: 'chat' | 'privacy' | 'telegram' | 'custom';
  gross_amount: number;
  platform_fee: number;
  admin_amount: number;
  model_amount: number;
  net_amount: number;
  currency: string;
  sale_date: string;
  description?: string;
  client_email?: string;
  transaction_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'manual' | 'email' | 'api';
  email_reference?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ChatSalesConfig {
  id: string;
  model_id: string;
  service_name: string;
  base_price: number;
  admin_percentage: number;
  model_percentage: number;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ChatSale {
  id: string;
  model_id: string;
  service_id?: string;
  service_name: string;
  customer_name?: string;
  customer_email?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  admin_amount: number;
  model_amount: number;
  admin_percentage: number;
  model_percentage: number;
  description?: string;
  sale_date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface EmailIntegration {
  id: string;
  name: string;
  email_provider: 'gmail' | 'outlook' | 'yahoo' | 'custom';
  email_address: string;
  imap_server?: string;
  imap_port?: number;
  use_ssl: boolean;
  username?: string;
  password_encrypted?: string;
  keywords: string[];
  is_active: boolean;
  last_sync?: string;
  sync_frequency: number; // em minutos
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface EmailSalesLog {
  id: string;
  integration_id: string;
  email_subject?: string;
  email_from?: string;
  email_date?: string;
  email_body?: string;
  extracted_amount?: number;
  extracted_platform?: string;
  extracted_client?: string;
  processing_status: 'pending' | 'processed' | 'ignored' | 'error';
  sale_id?: string;
  error_message?: string;
  created_at: string;
  user_id: string;
}

export interface FinancialReport {
  id: string;
  model_id?: string;
  report_type: 'monthly' | 'weekly' | 'daily' | 'custom';
  period_start: string;
  period_end: string;
  total_sales: number;
  total_admin_earnings: number;
  total_model_earnings: number;
  total_platform_fees: number;
  sales_count: number;
  top_platform?: string;
  metrics?: {
    growth_rate?: number;
    average_sale?: number;
    top_performing_model?: string;
    platform_distribution?: { [platform: string]: number };
    [key: string]: any;
  };
  generated_at: string;
  user_id: string;
}

// Interfaces para Forms
export interface CreateSaleForm {
  model_id: string;
  platform: string;
  sale_type: string;
  gross_amount: number;
  sale_date: string;
  description?: string;
  client_email?: string;
  transaction_id?: string;
}

export interface CreateChatSaleForm {
  customer_name: string;
  customer_email?: string;
  service_id: string;
  service_name: string;
  model_id: string;
  total_amount: number;
  admin_amount: number;
  model_amount: number;
  admin_percentage: number;
  model_percentage: number;
  description?: string;
  sale_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  quantity: number;
  unit_price: number;
}

export interface FinancialSettingsForm {
  model_id: string;
  platform_name: string;
  platform_percentage: number;
  admin_percentage: number;
  model_percentage: number;
}

export interface ChatSalesConfigForm {
  model_id: string;
  service_name: string;
  base_price: number;
  admin_percentage: number;
  model_percentage: number;
  description?: string;
}

export interface EmailIntegrationForm {
  name: string;
  email_provider: string;
  email_address: string;
  imap_server?: string;
  imap_port?: number;
  use_ssl: boolean;
  username?: string;
  password?: string;
  keywords: string[];
  sync_frequency: number;
}

// Interfaces para Dashboard
export interface FinancialDashboardData {
  totalRevenue: number;
  adminEarnings: number;
  modelEarnings: number;
  platformFees: number;
  salesCount: number;
  topModel: {
    id: string;
    name: string;
    earnings: number;
  };
  topPlatform: {
    name: string;
    revenue: number;
  };
  recentSales: Sale[];
  monthlyTrend: {
    month: string;
    revenue: number;
    sales: number;
  }[];
  platformDistribution: {
    platform: string;
    revenue: number;
    percentage: number;
  }[];
}

export interface ModelFinancialSummary {
  model_id: string;
  model_name: string;
  total_earnings: number;
  admin_share: number;
  platform_fees: number;
  sales_count: number;
  last_sale_date?: string;
  top_platform: string;
  monthly_average: number;
}

// Interfaces para Cálculos
export interface FinancialSplit {
  platform_fee: number;
  admin_amount: number;
  model_amount: number;
  net_amount: number;
}

export interface SalesFilters {
  model_id?: string;
  platform?: string;
  sale_type?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  source?: string;
}

export interface ChatSalesFilters {
  model_id?: string;
  service_name?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}

// Enums
export enum SaleType {
  CHAT = 'chat',
  PRIVACY = 'privacy',
  TELEGRAM = 'telegram',
  CUSTOM = 'custom'
}

export enum SaleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum SaleSource {
  MANUAL = 'manual',
  EMAIL = 'email',
  API = 'api'
}

export enum EmailProvider {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
  YAHOO = 'yahoo',
  CUSTOM = 'custom'
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  IGNORED = 'ignored',
  ERROR = 'error'
}

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

// Interfaces para API responses
export interface FinancialApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  per_page?: number;
}

export interface SalesListResponse extends FinancialApiResponse<Sale[]> {
  summary: {
    total_revenue: number;
    total_admin: number;
    total_model: number;
    total_fees: number;
  };
}

export interface EmailSyncResponse extends FinancialApiResponse<EmailSalesLog[]> {
  processed_count: number;
  new_sales_count: number;
  errors_count: number;
} 