
import React from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminReportsPanel } from '@/components/admin/AdminReportsPanel';

export default function AdminReportsPage() {
  return (
    <AdminRoute>
      <MainLayout>
        <AdminReportsPanel />
      </MainLayout>
    </AdminRoute>
  );
}
