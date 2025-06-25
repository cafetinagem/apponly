
import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface UserStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function UserStats({ pendingCount, approvedCount, rejectedCount }: UserStatsProps) {
  const stats = [
    {
      label: 'Pendentes',
      value: pendingCount,
      icon: Clock,
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-500'
    },
    {
      label: 'Aprovados',
      value: approvedCount,
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      iconColor: 'text-green-500'
    },
    {
      label: 'Rejeitados',
      value: rejectedCount,
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-4 transition-all duration-200 hover-lift border border-gray-200/50 dark:border-gray-700/50`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${stat.textColor} leading-tight`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                  {stat.label}
                </div>
              </div>
              <Icon className={`h-6 w-6 ${stat.iconColor} opacity-60`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
