
-- Verificar se a tabela models tem todas as colunas necessárias
-- Adicionar colunas que podem estar faltando para as plataformas e portfólio
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS rg TEXT,
ADD COLUMN IF NOT EXISTS height TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT,
ADD COLUMN IF NOT EXISTS bust TEXT,
ADD COLUMN IF NOT EXISTS waist TEXT,
ADD COLUMN IF NOT EXISTS hips TEXT,
ADD COLUMN IF NOT EXISTS shoes TEXT,
ADD COLUMN IF NOT EXISTS hair TEXT,
ADD COLUMN IF NOT EXISTS eyes TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb;

-- Atualizar a tabela model_sessions para garantir relacionamento correto
ALTER TABLE public.model_sessions 
ADD CONSTRAINT fk_model_sessions_model_id 
FOREIGN KEY (model_id) REFERENCES public.models(id) ON DELETE CASCADE;

-- Adicionar RLS policies para models se não existirem
DO $$ 
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'models' AND policyname = 'Users can view their own models'
    ) THEN
        CREATE POLICY "Users can view their own models" 
        ON public.models FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'models' AND policyname = 'Users can create their own models'
    ) THEN
        CREATE POLICY "Users can create their own models" 
        ON public.models FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'models' AND policyname = 'Users can update their own models'
    ) THEN
        CREATE POLICY "Users can update their own models" 
        ON public.models FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'models' AND policyname = 'Users can delete their own models'
    ) THEN
        CREATE POLICY "Users can delete their own models" 
        ON public.models FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Habilitar RLS na tabela models se não estiver habilitado
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Adicionar RLS policies para model_sessions se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_sessions' AND policyname = 'Users can view their own sessions'
    ) THEN
        CREATE POLICY "Users can view their own sessions" 
        ON public.model_sessions FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_sessions' AND policyname = 'Users can create their own sessions'
    ) THEN
        CREATE POLICY "Users can create their own sessions" 
        ON public.model_sessions FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_sessions' AND policyname = 'Users can update their own sessions'
    ) THEN
        CREATE POLICY "Users can update their own sessions" 
        ON public.model_sessions FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'model_sessions' AND policyname = 'Users can delete their own sessions'
    ) THEN
        CREATE POLICY "Users can delete their own sessions" 
        ON public.model_sessions FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Habilitar RLS na tabela model_sessions se não estiver habilitado
ALTER TABLE public.model_sessions ENABLE ROW LEVEL SECURITY;

-- Criar trigger para atualizar updated_at automaticamente na tabela models
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'handle_updated_at_models'
    ) THEN
        CREATE TRIGGER handle_updated_at_models
            BEFORE UPDATE ON public.models
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;
