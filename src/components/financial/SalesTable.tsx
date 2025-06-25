import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Plus,
  Calendar
} from 'lucide-react';
import { useFinancialData } from '@/hooks/financial/useFinancialData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale, SalesFilters } from '@/types/financial';

interface SalesTableProps {
  onCreateSale?: () => void;
  onEditSale?: (sale: Sale) => void;
  onViewSale?: (sale: Sale) => void;
}

export function SalesTable({ onCreateSale, onEditSale, onViewSale }: SalesTableProps) {
  const { sales, loading, loadSales, deleteSale } = useFinancialData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SalesFilters>({});

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === 'all' || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    loadSales(newFilters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: Implementar busca no backend
  };

  const handleDeleteSale = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      await deleteSale(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Confirmada', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlatformBadge = (platform: string) => {
    const platformConfig = {
      privacy: { label: 'Privacy', color: 'bg-red-100 text-red-800' },
      telegram: { label: 'Telegram', color: 'bg-blue-100 text-blue-800' },
      instagram: { label: 'Instagram', color: 'bg-pink-100 text-pink-800' },
      custom: { label: 'Personalizado', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.custom;
    return (
      <Badge className={config.color} variant="outline">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Vendas ({sales.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              onClick={onCreateSale}
              size="sm"
              className="gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={filters.platform || 'all'} 
              onValueChange={(value) => handleFilterChange('platform', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="privacy">Privacy</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.source || 'all'} 
              onValueChange={(value) => handleFilterChange('source', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Valor Bruto</TableHead>
                <TableHead>Seu Ganho</TableHead>
                <TableHead>Ganho Modelo</TableHead>
                <TableHead>Taxa Plataforma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {formatDate(sale.sale_date)}
                    </TableCell>
                    <TableCell>
                      {getPlatformBadge(sale.platform)}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(sale.gross_amount)}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      {formatCurrency(sale.admin_amount)}
                    </TableCell>
                    <TableCell className="font-semibold text-purple-600">
                      {formatCurrency(sale.model_amount)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(sale.platform_fee)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sale.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {sale.source === 'manual' ? 'Manual' : 
                         sale.source === 'email' ? 'Email' : 'API'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onViewSale?.(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEditSale?.(sale)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSale(sale.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          Nenhuma venda encontrada
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Registre sua primeira venda ou ajuste os filtros
                        </p>
                      </div>
                      <Button 
                        onClick={onCreateSale}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Registrar Venda
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo */}
        {sales.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total de Vendas:</span>
                <div className="font-bold text-green-600">
                  {formatCurrency(sales.reduce((sum, sale) => sum + sale.gross_amount, 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Seus Ganhos:</span>
                <div className="font-bold text-blue-600">
                  {formatCurrency(sales.reduce((sum, sale) => sum + sale.admin_amount, 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Ganhos das Modelos:</span>
                <div className="font-bold text-purple-600">
                  {formatCurrency(sales.reduce((sum, sale) => sum + sale.model_amount, 0))}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Taxas das Plataformas:</span>
                <div className="font-bold text-red-600">
                  {formatCurrency(sales.reduce((sum, sale) => sum + sale.platform_fee, 0))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 