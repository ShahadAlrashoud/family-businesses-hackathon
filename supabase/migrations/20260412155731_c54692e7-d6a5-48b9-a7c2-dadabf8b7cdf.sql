
-- Create category enum
CREATE TYPE public.regulation_category AS ENUM ('ownership', 'succession', 'exit', 'disputes', 'womens_role');

-- Create status enum
CREATE TYPE public.regulation_status AS ENUM ('draft', 'active');

-- Create regulations table
CREATE TABLE public.regulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category regulation_category NOT NULL,
  status regulation_status NOT NULL DEFAULT 'draft',
  content TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view
CREATE POLICY "Authenticated users can view regulations"
ON public.regulations FOR SELECT TO authenticated
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert regulations"
ON public.regulations FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update regulations"
ON public.regulations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete regulations"
ON public.regulations FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE TRIGGER update_regulations_updated_at
BEFORE UPDATE ON public.regulations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
