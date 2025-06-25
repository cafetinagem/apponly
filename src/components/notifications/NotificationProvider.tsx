import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
// import { NotificationToast } from './NotificationToast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen to real-time events
  useEffect(() => {
    if (!user) return;

    // Listen to new sales
    const salesChannel = supabase
      .channel('sales-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sales',
          filter: `model_id=eq.${user.id}`
        },
        (payload) => {
          const sale = payload.new as any;
          addNotification({
            title: '💰 Nova Venda!',
            message: `Venda de R$ ${sale.amount} registrada com sucesso!`,
            type: 'success',
            data: { saleId: sale.id }
          });
        }
      )
      .subscribe();

    // Listen to chat sales
    const chatSalesChannel = supabase
      .channel('chat-sales-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_sales',
          filter: `model_id=eq.${user.id}`
        },
        (payload) => {
          const chatSale = payload.new as any;
          addNotification({
            title: '💬 Nova Venda de Chat!',
            message: `Venda de chat de R$ ${chatSale.amount} registrada!`,
            type: 'success',
            data: { chatSaleId: chatSale.id }
          });
        }
      )
      .subscribe();

    // Listen to email integration results
    const emailChannel = supabase
      .channel('email-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'email_sales_logs'
        },
        (payload) => {
          const log = payload.new as any;
          if (log.status === 'success') {
            addNotification({
              title: '📧 Email Processado',
              message: `${log.sales_processed} vendas encontradas no email`,
              type: 'info'
            });
          } else {
            addNotification({
              title: '⚠️ Erro no Email',
              message: log.error_details || 'Erro ao processar email',
              type: 'warning'
            });
          }
        }
      )
      .subscribe();

    return () => {
      salesChannel.unsubscribe();
      chatSalesChannel.unsubscribe();
      emailChannel.unsubscribe();
    };
  }, [user]);

  // Performance threshold notifications
  useEffect(() => {
    const checkPerformance = async () => {
      if (!user) return;

      try {
        // Temporarily disable this feature until sales table is properly set up
        // const { data: monthlySales } = await supabase
        //   .from('sales')
        //   .select('amount')
        //   .eq('model_id', user.id)
        //   .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        // const monthlyRevenue = monthlySales?.reduce((sum, sale) => sum + sale.amount, 0) || 0;
        // const monthlyGoal = 10000; // R$ 10k

        // if (monthlyRevenue >= monthlyGoal * 0.9 && monthlyRevenue < monthlyGoal) {
        //   addNotification({
        //     title: '🎯 Quase lá!',
        //     message: `Você está a apenas R$ ${(monthlyGoal - monthlyRevenue).toFixed(2)} da sua meta mensal!`,
        //     type: 'warning',
        //     persistent: true
        //   });
        // } else if (monthlyRevenue >= monthlyGoal) {
        //   addNotification({
        //     title: '🎉 Meta Atingida!',
        //     message: `Parabéns! Você superou sua meta mensal de R$ ${monthlyGoal.toFixed(2)}!`,
        //     type: 'success',
        //     persistent: true
        //   });
        // }
      } catch (error) {
        console.error('Error checking performance:', error);
      }
    };

    // Check once when component mounts and then every hour
    checkPerformance();
    const interval = setInterval(checkPerformance, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 