
import { useState } from 'react';
import { Plus, X, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: Tag[];
  onCreateTag?: (name: string, color?: string) => Promise<Tag | null>;
  className?: string;
}

export function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  availableTags, 
  onCreateTag,
  className = "" 
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    setOpen(false);
  };

  const handleTagRemove = (tagName: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagName));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;

    setIsCreating(true);
    try {
      const newTag = await onCreateTag(newTagName.trim());
      if (newTag) {
        handleTagSelect(newTag.name);
        setNewTagName('');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const unselectedTags = availableTags.filter(tag => 
    !selectedTags.includes(tag.name)
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <TagIcon className="h-4 w-4" />
              Adicionar Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput 
                placeholder="Buscar tags..." 
                value={newTagName}
                onValueChange={setNewTagName}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500 mb-2">Nenhuma tag encontrada</p>
                    {onCreateTag && newTagName.trim() && (
                      <Button 
                        size="sm" 
                        onClick={handleCreateTag}
                        disabled={isCreating}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Criar "{newTagName}"
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                
                {unselectedTags.length > 0 && (
                  <CommandGroup heading="Tags disponíveis">
                    {unselectedTags.map(tag => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleTagSelect(tag.name)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {onCreateTag && newTagName.trim() && !availableTags.some(tag => 
                  tag.name.toLowerCase() === newTagName.toLowerCase()
                ) && (
                  <CommandGroup heading="Criar nova">
                    <CommandItem onSelect={handleCreateTag} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Criar "{newTagName}"
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tagName => {
            const tag = availableTags.find(t => t.name === tagName);
            return (
              <Badge 
                key={tagName} 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-gray-200"
                style={tag ? { borderColor: tag.color } : {}}
              >
                {tag && (
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: tag.color }}
                  />
                )}
                {tagName}
                <X 
                  className="h-3 w-3 hover:text-red-500" 
                  onClick={() => handleTagRemove(tagName)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
