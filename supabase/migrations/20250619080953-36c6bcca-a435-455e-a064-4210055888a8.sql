
-- Criar tabelas para o sistema OnlyCat
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'done')) DEFAULT 'todo',
  priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta')) DEFAULT 'media',
  platform TEXT,
  assignee TEXT NOT NULL CHECK (assignee IN ('executor', 'modelo')) DEFAULT 'executor',
  time_estimate INTEGER, -- em horas
  time_type TEXT NOT NULL CHECK (time_type IN ('estimate', 'deadline')) DEFAULT 'estimate',
  deadline TIMESTAMPTZ,
  elapsed_time BIGINT DEFAULT 0, -- em milliseconds
  timer_status TEXT NOT NULL CHECK (timer_status IN ('idle', 'running', 'paused')) DEFAULT 'idle',
  timer_start_time BIGINT,
  checklist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  artistic_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  bio TEXT,
  age INTEGER,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
  platforms JSONB DEFAULT '[]'::jsonb,
  portfolio_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.model_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  location TEXT NOT NULL,
  meeting_link TEXT,
  session_type TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled', 'in-progress')) DEFAULT 'scheduled',
  client_name TEXT,
  client_contact TEXT,
  payment DECIMAL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('task', 'note', 'session')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  language TEXT NOT NULL CHECK (language IN ('pt-BR', 'en-US')) DEFAULT 'pt-BR',
  notifications BOOLEAN DEFAULT true,
  auto_save BOOLEAN DEFAULT true,
  backup_frequency TEXT NOT NULL CHECK (backup_frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'weekly',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para models
CREATE POLICY "Users can view their own models" ON public.models FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own models" ON public.models FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own models" ON public.models FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own models" ON public.models FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para model_sessions
CREATE POLICY "Users can view their own sessions" ON public.model_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.model_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.model_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.model_sessions FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para notes
CREATE POLICY "Users can view their own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para categories
CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para settings
CREATE POLICY "Users can view their own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own settings" ON public.settings FOR DELETE USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_models_updated_at BEFORE UPDATE ON public.models FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar realtime para todas as tabelas
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.models REPLICA IDENTITY FULL;
ALTER TABLE public.model_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.notes REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.settings REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
ALTER PUBLICATION supabase_realtime ADD TABLE public.model_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;

-- Inserir categorias padrão
INSERT INTO public.categories (user_id, name, color, description, type) VALUES 
(null, 'Performance', 'bg-blue-100 text-blue-800', 'Análises de performance e métricas', 'note'),
(null, 'Ideias', 'bg-purple-100 text-purple-800', 'Ideias criativas e conceitos', 'note'),
(null, 'Briefing', 'bg-green-100 text-green-800', 'Briefings de projetos e sessões', 'note'),
(null, 'Feedback', 'bg-yellow-100 text-yellow-800', 'Feedbacks de clientes e modelos', 'note'),
(null, 'Planejamento', 'bg-red-100 text-red-800', 'Planejamento estratégico', 'task');
