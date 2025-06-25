
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { NoteCategoryManager } from './NoteCategoryManager';
import { NoteFileUpload } from './NoteFileUpload';
import { TagSelector } from './TagSelector';

interface NoteModalFormProps {
  formData: {
    title: string;
    content: string;
    category: string;
    modelId: string;
    attachmentUrl: string;
  };
  setFormData: (data: any) => void;
  models: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; color: string }>;
  onCreateCategory: (name: string, color?: string) => Promise<any>;
  onDeleteCategory?: (categoryId: string) => Promise<any>;
  onUpdateCategory?: (categoryId: string, updates: { name?: string; color?: string }) => Promise<any>;
  isEditing: boolean;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  availableTags?: Array<{ id: string; name: string; color: string }>;
  onCreateTag?: (name: string, color?: string) => Promise<any>;
}

export function NoteModalForm({
  formData,
  setFormData,
  models,
  categories,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  isEditing,
  selectedTags = [],
  onTagsChange = () => {},
  availableTags = [],
  onCreateTag
}: NoteModalFormProps) {
  const handleFileUploadSuccess = (url: string) => {
    console.log('Arquivo uploaded com sucesso:', url);
    setFormData({ ...formData, attachmentUrl: url });
  };

  const handleFileRemove = () => {
    console.log('Removendo anexo');
    setFormData({ ...formData, attachmentUrl: '' });
  };

  const handleCategoryChange = (category: string) => {
    setFormData({ ...formData, category });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Digite o título da nota..."
            required
          />
        </div>

        <div>
          <Label htmlFor="model">Modelo</Label>
          <Select value={formData.modelId} onValueChange={(value) => setFormData({ ...formData, modelId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar modelo (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Geral</SelectItem>
              {models
                .filter(model => model.id && model.id.trim() !== '')
                .map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <NoteCategoryManager
        selectedCategory={formData.category}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
      />

      <div>
        <Label>Tags</Label>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          availableTags={availableTags}
          onCreateTag={onCreateTag}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="content">Texto da Nota *</Label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Escreva o conteúdo da nota..."
        />
      </div>

      <NoteFileUpload
        attachmentUrl={formData.attachmentUrl}
        onFileUpload={handleFileUploadSuccess}
        onFileRemove={handleFileRemove}
      />
    </div>
  );
}
