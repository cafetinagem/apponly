import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { SalesTable } from '@/components/financial/SalesTable';
import { CreateSaleDialog } from '@/components/financial/CreateSaleDialog';
import { Sale } from '@/types/financial';

export default function SalesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  const handleCreateSale = () => {
    setCreateDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Gestão de Vendas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie todas as vendas das suas modelos
            </p>
          </div>

          <SalesTable
            onCreateSale={handleCreateSale}
            onEditSale={handleEditSale}
            onViewSale={handleViewSale}
          />

          {/* Dialog para criar nova venda */}
          <CreateSaleDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
          />

          {/* TODO: Adicionar dialogs para editar e visualizar vendas */}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 