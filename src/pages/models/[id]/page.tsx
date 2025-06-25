import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useModels } from '@/hooks/useModels';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit3, Calendar, Mail, Phone, MapPin, Share2, Heart, User, Camera } from 'lucide-react';
import { EditModelDialog } from '@/components/models/EditModelDialog';
import { CreateAppointmentDialog } from '@/components/appointments/CreateAppointmentDialog';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { Model, PlatformData } from '@/hooks/models/types';
import { MainLayout } from '@/components/layout/MainLayout';

function ModelDetailPageContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { models, updateModel, loading } = useModels();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();
  
  const [model, setModel] = useState<Model | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (models && id) {
      const foundModel = models.find(m => m.id === id);
      if (foundModel) {
        setModel(foundModel);
      } else {
        toast({
          title: "Modelo não encontrada",
          description: "A modelo solicitada não foi encontrada.",
          variant: "destructive"
        });
        navigate('/models');
      }
    }
  }, [models, id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando modelo...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Modelo não encontrado</h1>
          <Button onClick={() => navigate('/models')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Modelos
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveModel = async (modelData: any, platforms: PlatformData[]) => {
    try {
      await updateModel(model.id, { ...modelData, platforms });
      setShowEditDialog(false);
      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/models')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{model.name}</h1>
                <p className="text-gray-600">{model.artistic_name || 'Nome artístico não definido'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Curtido' : 'Curtir'}
              </Button>
              <Button onClick={() => setShowEditDialog(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button onClick={() => setShowCreateAppointment(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={model.portfolio_images?.[0]} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold text-gray-900">{model.name}</h2>
                <p className="text-gray-600 mb-2">{model.artistic_name}</p>
                
                <Badge 
                  variant={model.status === 'active' ? 'default' : 'secondary'}
                  className="mb-4"
                >
                  {model.status === 'active' ? 'Ativo' : 
                   model.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  <span className="text-sm">{model.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-3" />
                  <span className="text-sm">{model.phone}</span>
                </div>
                {(model.city || model.state) && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span className="text-sm">{model.city}, {model.state}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
              <TabsTrigger value="platforms">Plataformas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Bio */}
              {model.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>Biografia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{model.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{model.age || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Idade</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{model.height || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Altura</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{model.platforms?.length || 0}</div>
                    <div className="text-sm text-gray-600">Plataformas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{model.portfolio_images?.length || 0}</div>
                    <div className="text-sm text-gray-600">Fotos</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Nenhuma atividade recente registrada.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">CPF</Label>
                    <p className="text-gray-900">{model.cpf || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">RG</Label>
                    <p className="text-gray-900">{model.rg || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Nascimento</Label>
                    <p className="text-gray-900">{model.birth_date || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Gênero</Label>
                    <p className="text-gray-900">{model.gender || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Medidas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Altura</Label>
                    <p className="text-gray-900">{model.height || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Peso</Label>
                    <p className="text-gray-900">{model.weight || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Busto</Label>
                    <p className="text-gray-900">{model.bust || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Cintura</Label>
                    <p className="text-gray-900">{model.waist || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Quadril</Label>
                    <p className="text-gray-900">{model.hips || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Calçado</Label>
                    <p className="text-gray-900">{model.shoes || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Portfolio de Imagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {model.portfolio_images && model.portfolio_images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {model.portfolio_images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma imagem no portfolio</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plataformas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                  {model.platforms && model.platforms.length > 0 ? (
                    <div className="space-y-4">
                      {model.platforms.map((platform, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">{platform.type}</h4>
                            <Badge variant="outline">{platform.type}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {platform.username && <p><strong>Username:</strong> {platform.username}</p>}
                            {platform.email && <p><strong>Email:</strong> {platform.email}</p>}
                            {platform.phoneNumber && <p><strong>Telefone:</strong> {platform.phoneNumber}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma plataforma cadastrada</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditModelDialog
        model={model}
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveModel}
      />

      <CreateAppointmentDialog
        modelId={model.id}
        modelName={model.name}
        open={showCreateAppointment}
        onClose={() => setShowCreateAppointment(false)}
        onSave={createAppointment}
      />
    </div>
  );
}

export default function ModelDetailPage() {
  return (
    <MainLayout>
      <ModelDetailPageContent />
    </MainLayout>
  );
}
