import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SalesVolumeDataPoint {
  period: string;
  salesCount: number;
  revenue: number;
  averageTicket: number;
}

interface SalesVolumeChartProps {
  data: SalesVolumeDataPoint[];
  title?: string;
  height?: number;
  showRevenue?: boolean;
}

export function SalesVolumeChart({ 
  data, 
  title = "Volume de Vendas", 
  height = 400,
  showRevenue = true 
}: SalesVolumeChartProps) {
  
  const formatTooltipValue = (value: number, name: string) => {
    const labels: Record<string, string> = {
      salesCount: 'Número de Vendas',
      revenue: 'Receita',
      averageTicket: 'Ticket Médio'
    };
    
    if (name === 'salesCount') {
      return [value, labels[name]];
    }
    
    return [formatCurrency(value), labels[name] || name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    // Se for uma data
    if (tickItem.includes('-')) {
      const date = new Date(tickItem);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
    return tickItem;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              tickFormatter={formatXAxisLabel}
              className="text-xs"
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => value.toString()}
              className="text-xs"
            />
            {showRevenue && (
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tickFormatter={(value) => formatCurrency(value)}
                className="text-xs"
              />
            )}
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="salesCount" 
              fill="#f97316" 
              name="salesCount"
              radius={[2, 2, 0, 0]}
            />
            {showRevenue && (
              <Bar 
                yAxisId="right"
                dataKey="revenue" 
                fill="#3b82f6" 
                name="revenue"
                radius={[2, 2, 0, 0]}
                opacity={0.7}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 