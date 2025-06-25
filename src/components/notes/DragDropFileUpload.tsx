
import { useState, useRef } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';

interface DragDropFileUploadProps {
  onFileUpload: (url: string) => void;
  onFileRemove: () => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function DragDropFileUpload({
  onFileUpload,
  onFileRemove,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx']
}: DragDropFileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Verificar tamanho
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const url = await uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onFileUpload(url);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Erro no upload:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Erro ao fazer upload do arquivo');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (isUploading) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center space-y-4">
          <Upload className="mx-auto h-8 w-8 text-blue-500 animate-bounce" />
          <div>
            <p className="text-sm font-medium">Fazendo upload...</p>
            <Progress value={uploadProgress} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept={acceptedTypes.join(',')}
        className="hidden"
      />
      <div className="text-center space-y-4">
        <File className="mx-auto h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm font-medium">
            {isDragOver
              ? 'Solte o arquivo aqui'
              : 'Arraste um arquivo ou clique para selecionar'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Máximo {maxSizeMB}MB • {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
