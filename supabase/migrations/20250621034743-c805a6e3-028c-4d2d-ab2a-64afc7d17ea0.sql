
-- Implementar Row Level Security (RLS) em todas as tabelas principais
-- CRÍTICO: Estas políticas garantem segurança de dados

-- 1. TASKS - Políticas RLS completas
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

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

-- 2. USER_PROFILES - Políticas RLS e roles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Adicionar campo role para sistema robusto de permissões
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'executor' CHECK (role IN ('admin', 'executor', 'modelo'));

DROP POLICY IF EXISTS "Users can view profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Admins podem ver e gerenciar todos os perfis
CREATE POLICY "Admins can manage all profiles" 
  ON public.user_profiles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. MODELS - Políticas RLS
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

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

-- 4. NOTES - Políticas RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

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

-- 5. AUDIT LOGS - Nova tabela para logs de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  actor_id uuid REFERENCES auth.users(id),
  actor_email text,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para audit logs - apenas admins podem ver
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Atualizar função handle_new_user para incluir role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, nome, status_conta, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NEW.email),
    'pendente',
    CASE 
      WHEN NEW.email = 'onlycatbrasil@gmail.com' THEN 'admin'
      ELSE 'executor'
    END
  );
  RETURN NEW;
END;
$function$;

-- 7. Função para inserir logs de auditoria
CREATE OR REPLACE FUNCTION public.insert_audit_log(
  p_action text,
  p_entity_type text,
  p_entity_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.audit_logs (action, entity_type, entity_id, actor_id, actor_email, details)
  VALUES (
    p_action,
    p_entity_type,
    p_entity_id,
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    p_details
  );
END;
$function$;
