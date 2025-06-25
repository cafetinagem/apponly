
-- Remover políticas existentes que causam recursão
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow service role to manage all profiles" ON public.user_profiles;

-- Criar função de segurança definer para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Admin direto por email
  IF (SELECT email FROM auth.users WHERE id = auth.uid()) = 'onlycatbrasil@gmail.com' THEN
    RETURN true;
  END IF;
  
  -- Verificar role admin na tabela user_profiles (usando SELECT direto sem RLS)
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Criar políticas RLS corretas sem recursão
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para admins gerenciarem todos os perfis usando a função segura
CREATE POLICY "Admins can manage all profiles" 
  ON public.user_profiles 
  FOR ALL 
  USING (public.is_admin_user());

-- Política para permitir que o service role gerencie tudo
CREATE POLICY "Service role can manage all profiles" 
  ON public.user_profiles 
  FOR ALL 
  USING (auth.role() = 'service_role');
