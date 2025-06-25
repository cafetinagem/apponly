
import React from 'react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { SystemSettingsForm } from '@/components/admin/SystemSettingsForm';

export default function AdminSettingsPage() {
  return (
    <AdminRoute>
      <MainLayout>
        <SystemSettingsForm />
      </MainLayout>
    </AdminRoute>
  );
}
