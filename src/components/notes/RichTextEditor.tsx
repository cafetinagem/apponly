
import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Link, Image } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 10);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => insertMarkdown('**', '**'),
      title: 'Negrito'
    },
    {
      icon: Italic,
      action: () => insertMarkdown('*', '*'),
      title: 'Itálico'
    },
    {
      icon: List,
      action: () => insertMarkdown('\n- '),
      title: 'Lista'
    },
    {
      icon: Link,
      action: () => insertMarkdown('[', '](url)'),
      title: 'Link'
    },
    {
      icon: Image,
      action: () => insertMarkdown('![alt](', ')'),
      title: 'Imagem'
    }
  ];

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(\<li\>.*\<\/li\>)/s, '<ul>$1</ul>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          {isPreviewMode ? 'Editar' : 'Preview'}
        </Button>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[200px]">
        {isPreviewMode ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] border-0 resize-none focus:ring-0"
          />
        )}
      </div>

      {/* Footer com dicas */}
      <div className="p-2 text-xs text-gray-500 border-t bg-gray-50">
        Suporte a Markdown: **negrito**, *itálico*, - listas, [links](url), ![imagens](url)
      </div>
    </div>
  );
}
