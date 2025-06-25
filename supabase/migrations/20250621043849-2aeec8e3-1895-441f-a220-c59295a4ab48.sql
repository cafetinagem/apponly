
-- Ativar RLS nas tabelas que não estão ativas
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_categories ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para notes (se não existirem)
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

CREATE POLICY "Users can view their own notes" 
  ON public.notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
  ON public.notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar políticas RLS para note_categories (se não existirem)
DROP POLICY IF EXISTS "Users can view their own note categories" ON public.note_categories;
DROP POLICY IF EXISTS "Users can create their own note categories" ON public.note_categories;
DROP POLICY IF EXISTS "Users can update their own note categories" ON public.note_categories;
DROP POLICY IF EXISTS "Users can delete their own note categories" ON public.note_categories;

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
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note categories" 
  ON public.note_categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar trigger para updated_at na tabela notes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON public.notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_title_search ON public.notes USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON public.notes USING gin(to_tsvector('portuguese', content));
CREATE INDEX IF NOT EXISTS idx_note_categories_user_id ON public.note_categories(user_id);
