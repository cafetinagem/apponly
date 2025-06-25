
-- Add indexes for better query performance on frequently accessed columns

-- User-based queries optimization
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON public.tasks(status, priority);

CREATE INDEX IF NOT EXISTS idx_models_user_id ON public.models(user_id);
CREATE INDEX IF NOT EXISTS idx_models_status ON public.models(status);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON public.models(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_category ON public.notes(category);

CREATE INDEX IF NOT EXISTS idx_model_sessions_user_id ON public.model_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_model_sessions_model_id ON public.model_sessions(model_id);
CREATE INDEX IF NOT EXISTS idx_model_sessions_date ON public.model_sessions(date ASC);
CREATE INDEX IF NOT EXISTS idx_model_sessions_status ON public.model_sessions(status);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status_conta);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_user_status_created ON public.tasks(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_sessions_user_date ON public.model_sessions(user_id, date ASC);
CREATE INDEX IF NOT EXISTS idx_notes_user_category_created ON public.notes(user_id, category, created_at DESC);

-- Full-text search indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_notes_title_search ON public.notes USING gin(to_tsvector('portuguese', title));
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON public.notes USING gin(to_tsvector('portuguese', content));
CREATE INDEX IF NOT EXISTS idx_models_name_search ON public.models USING gin(to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_tasks_title_search ON public.tasks USING gin(to_tsvector('portuguese', title));

-- JSON field indexes for platform queries
CREATE INDEX IF NOT EXISTS idx_models_platforms ON public.models USING gin(platforms);

-- Partial indexes for active/pending records
CREATE INDEX IF NOT EXISTS idx_models_active ON public.models(user_id, created_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_user_profiles_pending ON public.user_profiles(data_cadastro DESC) WHERE status_conta = 'pendente';

-- Index for session queries with model relationship
CREATE INDEX IF NOT EXISTS idx_model_sessions_user_model_date ON public.model_sessions(user_id, model_id, date);
