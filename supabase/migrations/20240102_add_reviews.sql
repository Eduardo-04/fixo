-- Añadir campos para calificaciones y foto de perfil en la tabla profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3, 2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Agregar la categoría de Otros Oficios a la tabla de categorías
INSERT INTO public.categories (name, slug, description, icon_name)
VALUES ('Otros Servicios', 'otros-servicios', 'Servicios generales y especializados no clasificados.', 'Briefcase')
ON CONFLICT (slug) DO NOTHING;
