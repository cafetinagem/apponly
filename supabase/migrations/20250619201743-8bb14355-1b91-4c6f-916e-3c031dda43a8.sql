
-- Create table for model appointments
CREATE TABLE public.model_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_type TEXT CHECK (recurrence_type IN ('daily', 'weekly', 'monthly')),
  recurrence_end DATE,
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.model_appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own model appointments" 
  ON public.model_appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.model_appointments 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
