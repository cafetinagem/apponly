import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { FinancialDashboard } from '@/components/financial/FinancialDashboard';

export default function FinancialDashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <FinancialDashboard />
      </MainLayout>
    </ProtectedRoute>
  );
} 