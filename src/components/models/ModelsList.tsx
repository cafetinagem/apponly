
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModelCard } from './ModelCard';
import { ResponsiveGrid, ResponsiveContainer } from '@/components/responsive/ResponsiveContainer';
import { Model } from '@/hooks/models/types';
import { memo } from 'react';

interface ModelsListProps {
  models: Model[];
  onEditModel: (model: Model) => void;
  onDeleteModel: (modelId: string) => void;
}

export const ModelsList = memo(({ models, onEditModel, onDeleteModel }: ModelsListProps) => {
  const navigate = useNavigate();

  console.log('📋 [ModelsList] Rendering', models.length, 'models');

  if (!Array.isArray(models)) {
    console.warn('⚠️ [ModelsList] Models is not an array:', models);
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Carregando modelos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            onEdit={onEditModel}
            onDelete={onDeleteModel}
          />
        ))}
      </div>
    </div>
  );
});

ModelsList.displayName = 'ModelsList';
