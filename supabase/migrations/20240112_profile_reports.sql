CREATE TABLE public.profile_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.profile_reports ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (incluso usuarios no autenticados)
CREATE POLICY "Cualquiera puede crear reportes" 
ON public.profile_reports 
FOR INSERT 
WITH CHECK (true);

-- Solo administradores pueden ver los reportes
CREATE POLICY "Admins pueden ver reportes" 
ON public.profile_reports 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Solo administradores pueden actualizar los reportes
CREATE POLICY "Admins pueden actualizar reportes" 
ON public.profile_reports 
FOR UPDATE 
USING (
  auth.role() = 'authenticated' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
