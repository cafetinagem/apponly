
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface EditAppointmentBasicFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  modelName: string;
}

export const EditAppointmentBasicFields = ({ 
  formData, 
  setFormData, 
  modelName 
}: EditAppointmentBasicFieldsProps) => {
  return (
    <>
      <div>
        <Label>Modelo</Label>
        <Input
          value={modelName}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label>Título da Call *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Sessão de fotos Privacy"
          required
        />
      </div>

      <div>
        <Label>Data *</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Início *</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, startTime: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label>Fim *</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, endTime: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
          placeholder="Link da call, observações especiais..."
          rows={3}
        />
      </div>
    </>
  );
};
