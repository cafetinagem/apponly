
-- Criar tabela de relacionamento many-to-many entre notas e tags
CREATE TABLE public.note_tag_relations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES note_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(note_id, tag_id)
);

-- Enable RLS para note_tag_relations
ALTER TABLE public.note_tag_relations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para note_tag_relations
CREATE POLICY "Users can view their own note-tag relations" 
  ON public.note_tag_relations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own note-tag relations" 
  ON public.note_tag_relations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own note-tag relations" 
  ON public.note_tag_relations 
  FOR DELETE 
  USING (auth.uid() = user_id);
