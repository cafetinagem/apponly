
-- Create note_tags table
CREATE TABLE public.note_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create note_favorites table  
CREATE TABLE public.note_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, note_id)
);

-- Enable RLS for note_tags
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for note_tags
CREATE POLICY "Users can view their own tags" 
  ON public.note_tags 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
  ON public.note_tags 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
  ON public.note_tags 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
  ON public.note_tags 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS for note_favorites
ALTER TABLE public.note_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for note_favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.note_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.note_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.note_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);
