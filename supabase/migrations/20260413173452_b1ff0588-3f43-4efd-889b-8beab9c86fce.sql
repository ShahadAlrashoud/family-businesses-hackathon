
CREATE TYPE public.vote_choice AS ENUM ('approve', 'reject', 'abstain');

CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  regulation_id UUID NOT NULL REFERENCES public.regulations(id) ON DELETE CASCADE,
  vote vote_choice NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, regulation_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view votes"
  ON public.votes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can cast their own vote"
  ON public.votes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vote"
  ON public.votes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete votes"
  ON public.votes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
