
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelBasicFormProps {
  formData: {
    name: string;
    artistic_name: string;
    email: string;
    phone: string;
    bio: string;
    age: string;
    status: 'active' | 'inactive' | 'pending';
  };
  onFormChange: (field: string, value: string) => void;
}

export const ModelBasicForm = ({ formData, onFormChange }: ModelBasicFormProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name" className="text-sm font-medium text-foreground">
            Nome Completo*
          </Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Digite o nome completo"
            className="bg-background border-input text-foreground focus:border-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-artistic-name" className="text-sm font-medium text-foreground">
            Nome Artístico
          </Label>
          <Input
            id="edit-artistic-name"
            value={formData.artistic_name}
            onChange={(e) => onFormChange('artistic_name', e.target.value)}
            placeholder="Nome profissional ou fantasia"
            className="bg-background border-input text-foreground focus:border-ring"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-email" className="text-sm font-medium text-foreground">
            E-mail*
          </Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            placeholder="email@exemplo.com"
            className="bg-background border-input text-foreground focus:border-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-phone" className="text-sm font-medium text-foreground">
            Telefone*
          </Label>
          <Input
            id="edit-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
            className="bg-background border-input text-foreground focus:border-ring"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-age" className="text-sm font-medium text-foreground">
            Idade
          </Label>
          <Input
            id="edit-age"
            type="number"
            value={formData.age}
            onChange={(e) => onFormChange('age', e.target.value)}
            placeholder="25"
            className="bg-background border-input text-foreground focus:border-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-status" className="text-sm font-medium text-foreground">
            Status
          </Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onFormChange('status', value)}
          >
            <SelectTrigger className="bg-background border-input text-foreground focus:border-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Ativo</span>
                </div>
              </SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Pendente</span>
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Inativo</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Biography */}
      <div className="space-y-2">
        <Label htmlFor="edit-bio" className="text-sm font-medium text-foreground">
          Biografia
        </Label>
        <Textarea
          id="edit-bio"
          value={formData.bio}
          onChange={(e) => onFormChange('bio', e.target.value)}
          rows={4}
          className="resize-none bg-background border-input text-foreground focus:border-ring"
          placeholder="Descrição profissional, experiência, especialidades..."
        />
        <p className="text-xs text-muted-foreground">
          Opcional: Adicione informações sobre experiência, especialidades ou características marcantes
        </p>
      </div>
    </div>
  );
};
