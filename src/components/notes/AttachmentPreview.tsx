
import { Button } from '@/components/ui/button';
import { X, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface AttachmentPreviewProps {
  url: string;
  fileName?: string;
}

export function AttachmentPreview({ url, fileName }: AttachmentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const displayName = fileName || url.split('/').pop() || 'Arquivo';

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isImage ? (
            <img 
              src={url} 
              alt={displayName}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
              📄
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium truncate max-w-[200px]">
              {displayName}
            </p>
            <p className="text-xs text-gray-500">Anexo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(url, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              // Remove attachment logic would go here
            }}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && isImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img 
              src={url} 
              alt={displayName}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
