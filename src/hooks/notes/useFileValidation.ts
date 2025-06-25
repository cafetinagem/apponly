
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export function useFileValidation() {
  const { toast } = useToast();

  const validateFile = useCallback((file: File): ValidationResult => {
    const warnings: string[] = [];

    // Verificar se o arquivo existe
    if (!file) {
      return {
        isValid: false,
        error: 'Nenhum arquivo selecionado'
      };
    }

    // Verificar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Limite máximo: 10MB`
      };
    }

    // Verificar tipo do arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não permitido: ${file.type}. Use apenas imagens, PDF, DOC, DOCX ou TXT.`
      };
    }

    // Avisos para arquivos grandes mas válidos
    if (file.size > 5 * 1024 * 1024) {
      warnings.push('Arquivo grande (>5MB) pode demorar para carregar');
    }

    // Avisar sobre tipos específicos
    if (file.type === 'image/svg+xml') {
      warnings.push('Arquivos SVG podem ter problemas de visualização');
    }

    // Verificar nome do arquivo
    if (file.name.length > 100) {
      warnings.push('Nome do arquivo muito longo');
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }, []);

  const validateAndToast = useCallback((file: File): boolean => {
    const result = validateFile(file);

    if (!result.isValid) {
      toast({
        title: "Arquivo inválido",
        description: result.error,
        variant: "destructive"
      });
      return false;
    }

    if (result.warnings && result.warnings.length > 0) {
      toast({
        title: "Aviso sobre o arquivo",
        description: result.warnings.join('; '),
        variant: "default"
      });
    }

    return true;
  }, [validateFile, toast]);

  const getFileIcon = useCallback((mimeType: string) => {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType === 'text/plain') return '📋';
    return '📎';
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    validateFile,
    validateAndToast,
    getFileIcon,
    formatFileSize,
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES
  };
}
