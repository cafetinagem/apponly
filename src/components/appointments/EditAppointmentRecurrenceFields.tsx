
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  isRecurring: boolean;
  recurrenceType: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd: string;
}

interface EditAppointmentRecurrenceFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const EditAppointmentRecurrenceFields = ({ 
  formData, 
  setFormData 
}: EditAppointmentRecurrenceFieldsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isRecurring}
          onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isRecurring: checked }))}
        />
        <Label>Agendamento recorrente</Label>
      </div>

      {formData.isRecurring && (
        <>
          <div>
            <Label>Tipo de recorrência</Label>
            <Select
              value={formData.recurrenceType}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFormData((prev: any) => ({ ...prev, recurrenceType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diária</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fim da recorrência</Label>
            <Input
              type="date"
              value={formData.recurrenceEnd}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, recurrenceEnd: e.target.value }))}
            />
          </div>
        </>
      )}
    </>
  );
};
