import React, { useState } from 'react';
import { useNotifications } from './NotificationProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Trash2,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const colorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
};

export function NotificationCenter() {
  const { 
    notifications, 
    removeNotification, 
    markAsRead, 
    markAllAsRead, 
    clearAll, 
    unreadCount 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.read;
      case 'success':
        return notification.type === 'success';
      case 'warning':
        return notification.type === 'warning' || notification.type === 'error';
      default:
        return true;
    }
  });

  const groupedNotifications = {
    today: filteredNotifications.filter(n => 
      new Date(n.timestamp).toDateString() === new Date().toDateString()
    ),
    yesterday: filteredNotifications.filter(n => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(n.timestamp).toDateString() === yesterday.toDateString();
    }),
    older: filteredNotifications.filter(n => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(n.timestamp) < yesterday;
    })
  };

  const renderNotificationGroup = (title: string, notifications: typeof filteredNotifications) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type];
            const iconColor = colorMap[notification.type];

            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all cursor-pointer hover:bg-muted/50',
                  !notification.read && 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          'font-medium text-sm',
                          !notification.read && 'font-semibold'
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="h-2 w-2 p-0 bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                        <div className="flex items-center gap-1">
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action?.onClick();
                                markAsRead(notification.id);
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                className="text-xs"
              >
                                 <Check className="h-3 w-3 mr-1" />
                 Marcar como lidas
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={clearAll}
              className="text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpar todas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              Todas ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Não lidas ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="success">
              Sucessos
            </TabsTrigger>
            <TabsTrigger value="warning">
              Alertas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-96 pr-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {activeTab === 'unread' 
                      ? 'Nenhuma notificação não lida'
                      : 'Nenhuma notificação'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {renderNotificationGroup('Hoje', groupedNotifications.today)}
                  {renderNotificationGroup('Ontem', groupedNotifications.yesterday)}
                  {renderNotificationGroup('Mais antigas', groupedNotifications.older)}
                </>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 