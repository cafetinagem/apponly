
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useModels } from '@/hooks/useModels';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { PlatformData } from '@/hooks/models/types';
import { ModelBasicForm } from './ModelBasicForm';
import { PlatformsManager } from './PlatformsManager';

export const ModelRegistrationForm = () => {
  const navigate = useNavigate();
  const { createModel } = useModels();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    artistic_name: '',
    email: '',
    phone: '',
    bio: '',
    age: '',
    status: 'active' as const
  });

  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

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

  const togglePassword = (platformId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Erro",
        description: "Telefone é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('📤 [RegisterForm] Submitting model with platforms:', platforms);
      
      const result = await createModel({
        name: formData.name,
        artistic_name: formData.artistic_name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : undefined,
        status: formData.status,
        platforms: platforms
      });

      if (result) {
        console.log('✅ [RegisterForm] Model created successfully');
        navigate('/models');
      }
    } catch (error) {
      console.error('❌ [RegisterForm] Error creating model:', error);
    }
  };

  const handleCancel = () => {
    navigate('/models');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-card border border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-foreground mb-2">Informações Básicas</h2>
            <p className="text-sm text-muted-foreground">Dados principais do modelo</p>
          </div>
          <ModelBasicForm 
            formData={formData}
            onFormChange={handleFormChange}
          />
        </div>

        {/* Platforms Section */}
        <div className="bg-card border border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-foreground mb-2">Plataformas</h2>
            <p className="text-sm text-muted-foreground">Configure as contas do modelo nas diferentes plataformas</p>
          </div>
          <PlatformsManager
            platforms={platforms}
            onAddPlatform={addPlatform}
            onUpdatePlatform={updatePlatform}
            onRemovePlatform={removePlatform}
            showPassword={showPassword}
            onTogglePassword={togglePassword}
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-card border border-border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-foreground">Pronto para cadastrar?</h3>
              <p className="text-xs text-muted-foreground mt-1">Verifique as informações antes de confirmar</p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 text-sm text-muted-foreground border border-border bg-background hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Cadastrar Modelo</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
