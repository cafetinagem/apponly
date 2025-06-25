
import { TagIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TagFilterProps {
  tags: Array<{ id: string; name: string; color: string }>;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ tags, selectedTags, onTagsChange }: TagFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
      <Select
        value={selectedTags[0] || "all"}
        onValueChange={(value) => onTagsChange(value === "all" ? [] : [value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas tags</SelectItem>
          {tags.map(tag => (
            <SelectItem key={tag.id} value={tag.name}>
              <div className="flex items-center gap-2">
                <TagIcon className="h-3 w-3" style={{ color: tag.color }} />
                {tag.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
