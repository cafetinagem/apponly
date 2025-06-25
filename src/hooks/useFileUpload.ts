
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) {
      console.error('Usuário não autenticado');
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    console.log('Iniciando upload:', { fileName: file.name, fileSize: file.size, fileType: file.type });

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Limite máximo: 10MB",
        variant: "destructive"
      });
      return null;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('Tipo de arquivo não permitido:', file.type);
      toast({
        title: "Erro",
        description: "Tipo de arquivo não permitido. Use apenas imagens, PDF, DOC, DOCX ou TXT.",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Fazendo upload para:', { bucket: 'note-attachments', filePath });

      const { data, error } = await supabase.storage
        .from('note-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload do Supabase:', error);
        toast({
          title: "Erro no upload",
          description: error.message || "Erro desconhecido no upload",
          variant: "destructive"
        });
        return null;
      }

      console.log('Upload realizado com sucesso:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('note-attachments')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', publicUrl);

      if (!publicUrl) {
        throw new Error('Não foi possível gerar URL pública');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erro geral no upload:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o upload",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (url: string): Promise<boolean> => {
    if (!user) {
      console.error('Usuário não autenticado para deletar arquivo');
      return false;
    }

    try {
      console.log('Tentando deletar arquivo:', url);
      
      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      console.log('Caminho do arquivo para deletar:', filePath);

      const { error } = await supabase.storage
        .from('note-attachments')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo do storage:', error);
        return false;
      }

      console.log('Arquivo deletado com sucesso do storage');
      return true;
    } catch (error) {
      console.error('Erro geral ao deletar arquivo:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading
  };
}
