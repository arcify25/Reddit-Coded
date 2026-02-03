-- Create posts table for the digital graffiti wall
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Humor', 'Confession', 'Idea', 'Motivation')),
  likes INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL,
  rotation NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view posts (public wall)
CREATE POLICY "Anyone can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

-- Allow anyone to create posts (anonymous posting)
CREATE POLICY "Anyone can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update likes on posts
CREATE POLICY "Anyone can like posts" 
ON public.posts 
FOR UPDATE 
USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;