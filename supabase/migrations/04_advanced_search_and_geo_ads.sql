-- Habilitar extensiones para búsqueda avanzada y tolerancia a errores ortográficos
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Modificar tabla de banners para permitir segmentación geográfica
ALTER TABLE public.banners
ADD COLUMN IF NOT EXISTS target_state TEXT,
ADD COLUMN IF NOT EXISTS target_city TEXT;

-- Reemplazar el trigger de creación de usuarios para que ya no fuerce "Tuxtla Gutiérrez"
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  user_name TEXT;
  user_phone TEXT;
  user_role_val user_role;
  user_city TEXT;
  user_state TEXT;
BEGIN
  -- Extraer los datos del meta_data
  user_name := COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario ' || substr(new.id::text, 1, 6));
  user_phone := new.raw_user_meta_data->>'phone';
  
  -- Ubicación (ahora puede venir vacía o del frontend)
  user_city := new.raw_user_meta_data->>'city';
  user_state := new.raw_user_meta_data->>'state';
  
  -- Extraer y validar el rol solicitado, por defecto 'client'
  IF (new.raw_user_meta_data->>'role' = 'technician') THEN
      user_role_val := 'technician';
  ELSIF (new.raw_user_meta_data->>'role' = 'admin') THEN
      user_role_val := 'admin';
  ELSE
      user_role_val := 'client';
  END IF;

  -- Generar slug base
  base_slug := lower(regexp_replace(user_name, '\s+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\-]', '', 'g');
  final_slug := base_slug || '-' || floor(random() * 9000 + 1000)::text;

  -- Insertar el perfil
  INSERT INTO public.profiles (
    id, full_name, slug, phone_whatsapp, role, city, state
  )
  VALUES (
    new.id, user_name, final_slug, user_phone, user_role_val, user_city, user_state
  );
  
  RETURN new;
END;
$$;

-- Crear una función para búsqueda avanzada (RPC)
CREATE OR REPLACE FUNCTION search_technicians_advanced(
  search_query TEXT DEFAULT '',
  filter_state TEXT DEFAULT '',
  filter_city TEXT DEFAULT '',
  filter_cfdi BOOLEAN DEFAULT false,
  filter_category_slug TEXT DEFAULT ''
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  slug TEXT,
  role user_role,
  city TEXT,
  state TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN,
  is_pro BOOLEAN,
  boost_expires_at TIMESTAMPTZ,
  verification_status TEXT,
  rating_average NUMERIC,
  reviews_count INTEGER,
  phone_whatsapp TEXT,
  experience_years INTEGER,
  emits_cfdi BOOLEAN,
  neighborhoods_covered TEXT[],
  bio TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.full_name, p.slug, p.role, p.city, p.state, p.avatar_url, p.is_verified, p.is_pro, p.boost_expires_at, p.verification_status, p.rating_average, p.reviews_count, p.phone_whatsapp, p.experience_years, p.emits_cfdi, p.neighborhoods_covered, p.bio
  FROM profiles p
  -- Si hay filtro de categoría, hacemos JOIN
  LEFT JOIN technician_categories tc ON tc.profile_id = p.id
  LEFT JOIN categories c ON c.id = tc.category_id
  WHERE p.role = 'technician'
    AND (
      filter_category_slug = '' OR c.slug = filter_category_slug OR filter_category_slug = 'todos'
    )
    AND (
      filter_state = '' OR filter_state = 'Todos los estados' OR p.state = filter_state
    )
    AND (
      filter_city = '' OR filter_city = 'Todas las ciudades' OR p.city = filter_city
    )
    AND (
      filter_cfdi = false OR p.emits_cfdi = true
    )
    AND (
      search_query = '' 
      OR unaccent(lower(p.full_name)) LIKE '%' || unaccent(lower(search_query)) || '%'
      OR unaccent(lower(COALESCE(p.bio, ''))) LIKE '%' || unaccent(lower(search_query)) || '%'
      OR unaccent(lower(c.name)) LIKE '%' || unaccent(lower(search_query)) || '%'
      -- Tolerancia a errores usando pg_trgm
      OR unaccent(lower(p.full_name)) % unaccent(lower(search_query))
      OR unaccent(lower(c.name)) % unaccent(lower(search_query))
    )
  -- Asegurar resultados únicos
  GROUP BY p.id
  ORDER BY 
    p.boost_expires_at DESC NULLS LAST,
    p.is_pro DESC,
    p.verification_status DESC,
    p.views_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
