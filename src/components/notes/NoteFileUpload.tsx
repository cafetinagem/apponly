
import { DragDropFileUpload } from './DragDropFileUpload';
import { AttachmentPreview } from './AttachmentPreview';
import { Label } from '@/components/ui/label';

interface NoteFileUploadProps {
  attachmentUrl?: string;
  onFileUpload: (url: string) => void;
  onFileRemove: () => void;
}

export function NoteFileUpload({
  attachmentUrl,
  onFileUpload,
  onFileRemove
}: NoteFileUploadProps) {
  return (
    <div className="space-y-4">
      <Label>Anexos</Label>
      
      {attachmentUrl ? (
        <AttachmentPreview 
          url={attachmentUrl}
          fileName={attachmentUrl.split('/').pop()}
        />
      ) : (
        <DragDropFileUpload
          onFileUpload={onFileUpload}
          onFileRemove={onFileRemove}
          maxSizeMB={10}
          acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
        />
      )}
    </div>
  );
}
