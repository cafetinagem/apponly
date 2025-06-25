import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/protected-route';
import { QuickEmailSetup } from '@/components/financial/QuickEmailSetup';

export default function SimpleEmailPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6">
          <QuickEmailSetup />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 