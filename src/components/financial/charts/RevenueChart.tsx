import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  adminEarnings: number;
  modelEarnings: number;
  platformFees: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  title?: string;
  height?: number;
}

export function RevenueChart({ data, title = "Evolução da Receita", height = 400 }: RevenueChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    const labels: Record<string, string> = {
      revenue: 'Receita Total',
      adminEarnings: 'Seus Ganhos',
      modelEarnings: 'Ganhos das Modelos',
      platformFees: 'Taxas da Plataforma'
    };
    return [formatCurrency(value), labels[name] || name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              className="text-xs"
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="revenue"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="adminEarnings" 
              stroke="#10b981" 
              strokeWidth={2}
              name="adminEarnings"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="modelEarnings" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="modelEarnings"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="platformFees" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="platformFees"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 