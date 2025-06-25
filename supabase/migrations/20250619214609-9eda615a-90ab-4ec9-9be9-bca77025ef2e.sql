
-- Adicionar campo title à tabela notes
ALTER TABLE public.notes 
ADD COLUMN title TEXT;

-- Criar tabela de categorias se não existir (para o dropdown de categorias)
CREATE TABLE IF NOT EXISTS public.note_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS à tabela de categorias
ALTER TABLE public.note_categories ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias
CREATE POLICY "Users can view their own note categories" 
  ON public.note_categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own note categories" 
  ON public.note_categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own note categories" 
  ON public.note_categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note categories" 
  ON public.note_categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Inserir categorias padrão
INSERT INTO public.note_categories (name, color, user_id)
SELECT 'Performance', '#3B82F6', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.note_categories (name, color, user_id)
SELECT 'Ideias', '#8B5CF6', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.note_categories (name, color, user_id)
SELECT 'Briefing', '#10B981', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.note_categories (name, color, user_id)
SELECT 'Feedback', '#F59E0B', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.note_categories (name, color, user_id)
SELECT 'Planejamento', '#EF4444', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Adicionar campo attachment_url à tabela notes
ALTER TABLE public.notes 
ADD COLUMN attachment_url TEXT;

-- Atualizar notas existentes para ter um título baseado no conteúdo
UPDATE public.notes 
SET title = CASE 
  WHEN LENGTH(content) > 50 THEN LEFT(content, 50) || '...'
  ELSE content
END
WHERE title IS NULL;

-- Fazer o título obrigatório após a atualização
ALTER TABLE public.notes 
ALTER COLUMN title SET NOT NULL;
