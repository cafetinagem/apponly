
-- Implementar RLS completo para todas as tabelas críticas

-- 1. TASKS - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 2. MODELS - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own models" ON public.models;
DROP POLICY IF EXISTS "Users can create their own models" ON public.models;
DROP POLICY IF EXISTS "Users can update their own models" ON public.models;
DROP POLICY IF EXISTS "Users can delete their own models" ON public.models;

CREATE POLICY "Users can view their own models" 
  ON public.models 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own models" 
  ON public.models 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own models" 
  ON public.models 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own models" 
  ON public.models 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. NOTES - Implementar políticas RLS completas
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

-- 4. MODEL_SESSIONS - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.model_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON public.model_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.model_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.model_sessions;

CREATE POLICY "Users can view their own sessions" 
  ON public.model_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.model_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.model_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
  ON public.model_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. MODEL_APPOINTMENTS - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own model appointments" ON public.model_appointments;
DROP POLICY IF EXISTS "Users can create their own model appointments" ON public.model_appointments;
DROP POLICY IF EXISTS "Users can update their own model appointments" ON public.model_appointments;
DROP POLICY IF EXISTS "Users can delete their own model appointments" ON public.model_appointments;

CREATE POLICY "Users can view their own model appointments" 
  ON public.model_appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own model appointments" 
  ON public.model_appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own model appointments" 
  ON public.model_appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own model appointments" 
  ON public.model_appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. NOTE_CATEGORIES - Implementar políticas RLS completas
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

-- 7. CATEGORIES - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Users can view their own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 8. SETTINGS - Implementar políticas RLS completas
DROP POLICY IF EXISTS "Users can view their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can create their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.settings;

CREATE POLICY "Users can view their own settings" 
  ON public.settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.settings 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
  ON public.settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Garantir que todas as tabelas tenham RLS ativado
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
