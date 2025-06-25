
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ModelBasicForm } from './ModelBasicForm';
import { PlatformsManager } from './PlatformsManager';
import { CreateAppointmentDialog } from '../appointments/CreateAppointmentDialog';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { PlatformData, Model } from '@/hooks/models/types';

interface EditModelDialogProps {
  model: Model;
  open: boolean;
  onClose: () => void;
  onSave: (modelData: any, platforms: PlatformData[]) => void;
}

export const EditModelDialog = ({ model, open, onClose, onSave }: EditModelDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    artistic_name: '',
    email: '',
    phone: '',
    bio: '',
    age: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);

  const { createAppointment } = useAppointments();

  useEffect(() => {
    if (model) {
      console.log('🔄 [EditModelDialog] Setting form data for model:', model.id);
      
      setFormData({
        name: model.name || '',
        artistic_name: model.artistic_name || '',
        email: model.email || '',
        phone: model.phone || '',
        bio: model.bio || '',
        age: model.age ? model.age.toString() : '',
        status: model.status || 'active'
      });
      
      // Convert model platforms to PlatformData format
      const modelPlatforms = model.platforms || [];
      const formattedPlatforms: PlatformData[] = modelPlatforms.map((platform: any, index: number) => ({
        id: platform.id || `${platform.type}-${index}`,
        type: platform.type as 'instagram' | 'telegram' | 'privacy',
        name: platform.name || platform.type,
        username: platform.username || '',
        email: platform.email || '',
        password: platform.password || '',
        phoneNumber: platform.phoneNumber || ''
      }));
      
      console.log('🔄 [EditModelDialog] Setting platforms:', formattedPlatforms);
      setPlatforms(formattedPlatforms);
    }
  }, [model]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPlatform = (type: 'instagram' | 'telegram' | 'privacy') => {
    const newPlatform: PlatformData = {
      id: Date.now().toString(),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      username: '',
      email: '',
      password: '',
      phoneNumber: ''
    };
    setPlatforms(prev => [...prev, newPlatform]);
  };

  const updatePlatform = (id: string, field: string, value: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === id ? { ...platform, [field]: value } : platform
    ));
  };

  const removePlatform = (id: string) => {
    setPlatforms(prev => prev.filter(p => p.id !== id));
  };

  const togglePasswordVisibility = (platformId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const handleSave = () => {
    console.log('📤 [EditModelDialog] Saving model with data:', formData, 'platforms:', platforms);
    onSave(formData, platforms);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>🔧 Editar Modelo</span>
              <Button 
                onClick={() => setShowCreateAppointment(true)} 
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Horário
              </Button>
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Atualize as informações cadastradas da modelo
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            <ModelBasicForm 
              formData={formData}
              onFormChange={handleFormChange}
            />

            <PlatformsManager
              platforms={platforms}
              onAddPlatform={addPlatform}
              onUpdatePlatform={updatePlatform}
              onRemovePlatform={removePlatform}
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
            />

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                💾 Salvar Alterações
              </Button>
              <Button variant="outline" onClick={onClose}>
                ❌ Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateAppointmentDialog
        modelId={model?.id || ''}
        modelName={model?.name || ''}
        open={showCreateAppointment}
        onClose={() => setShowCreateAppointment(false)}
        onSave={createAppointment}
      />
    </>
  );
};
