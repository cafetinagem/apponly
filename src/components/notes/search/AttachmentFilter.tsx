
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttachmentFilterProps {
  hasAttachments: boolean | null;
  onHasAttachmentsChange: (hasAttachments: boolean | null) => void;
}

export function AttachmentFilter({ hasAttachments, onHasAttachmentsChange }: AttachmentFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Anexos</label>
      <Select
        value={hasAttachments === null ? "all" : hasAttachments.toString()}
        onValueChange={(value) => onHasAttachmentsChange(
          value === "all" ? null : value === "true"
        )}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Com anexos</SelectItem>
          <SelectItem value="false">Sem anexos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
