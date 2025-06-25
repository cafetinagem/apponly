
-- Criar bucket para anexos das notas
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-attachments', 'note-attachments', true);

-- Política para permitir que usuários façam upload de seus próprios anexos
CREATE POLICY "Users can upload their own note attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir que usuários visualizem seus próprios anexos
CREATE POLICY "Users can view their own note attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir que usuários deletem seus próprios anexos
CREATE POLICY "Users can delete their own note attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
