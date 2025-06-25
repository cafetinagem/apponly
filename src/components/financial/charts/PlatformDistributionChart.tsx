import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PlatformData {
  name: string;
  value: number;
  sales: number;
  color: string;
}

interface PlatformDistributionChartProps {
  data: PlatformData[];
  title?: string;
  height?: number;
}

const PLATFORM_COLORS = {
  privacy: '#3b82f6',
  telegram: '#0ea5e9',
  instagram: '#e11d48',
  chat: '#8b5cf6',
  onlyfans: '#f59e0b',
  custom: '#6b7280'
};

export function PlatformDistributionChart({ 
  data, 
  title = "Distribuição por Plataforma", 
  height = 400 
}: PlatformDistributionChartProps) {
  
  const processedData = data.map(item => ({
    ...item,
    color: PLATFORM_COLORS[item.name.toLowerCase() as keyof typeof PLATFORM_COLORS] || '#6b7280'
  }));

  const formatTooltipValue = (value: number, name: string, props: any) => {
    const percentage = ((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return [
      `${formatCurrency(value)} (${percentage}%)`,
      `${props.payload.sales} vendas`
    ];
  };

  const formatLegend = (value: string, entry: any) => {
    const item = processedData.find(d => d.name === value);
    const percentage = ((item?.value || 0) / data.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1);
    return `${value.charAt(0).toUpperCase() + value.slice(1)} (${percentage}%)`;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Não mostrar label se menor que 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
            />
            <Legend 
              formatter={formatLegend}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 