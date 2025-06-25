
-- Corrigir a função handle_updated_at para incluir search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Adicionar coluna status_conta na tabela de perfis/usuários
-- Como não temos uma tabela profiles específica, vamos criar uma para gerenciar status de contas
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status_conta TEXT NOT NULL DEFAULT 'pendente' CHECK (status_conta IN ('pendente', 'aprovado', 'rejeitado')),
  email TEXT NOT NULL,
  nome TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  aprovado_por TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS à tabela user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins podem ver todos os perfis (assumindo que existe um sistema de roles)
CREATE POLICY "Allow service role to manage all profiles" 
  ON public.user_profiles 
  FOR ALL 
  USING (true);

-- Trigger para updated_at na tabela user_profiles
CREATE TRIGGER handle_updated_at_user_profiles 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Função para criar perfil automático quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, nome, status_conta)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NEW.email),
    'pendente'
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para verificar se usuário está aprovado
CREATE OR REPLACE FUNCTION public.is_user_approved(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = user_uuid AND status_conta = 'aprovado'
  );
END;
$$;
