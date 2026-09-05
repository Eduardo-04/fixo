-- =========================================================================
-- FIXO: Trigger de Sincronización Automática de Perfiles
-- =========================================================================

-- 1. Crear la función que ejecutará el Trigger
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
BEGIN
  -- Extraer los datos del meta_data (pasados desde el frontend en signUp)
  user_name := COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario ' || substr(new.id::text, 1, 6));
  user_phone := COALESCE(new.raw_user_meta_data->>'phone', '0000000000');

  -- Generar slug base (letras, números y guiones)
  base_slug := lower(regexp_replace(user_name, '\s+', '-', 'g'));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\-]', '', 'g');
  
  -- Añadir 4 números aleatorios al final para garantizar unicidad
  final_slug := base_slug || '-' || floor(random() * 9000 + 1000)::text;

  -- Insertar el perfil en la tabla pública
  INSERT INTO public.profiles (
    id, 
    full_name, 
    slug, 
    phone_whatsapp, 
    role,
    city,
    state
  )
  VALUES (
    new.id,
    user_name,
    final_slug,
    user_phone,
    'technician',
    'Tuxtla Gutiérrez',
    'Chiapas'
  );
  
  RETURN new;
END;
$$;

-- 2. Eliminar el trigger si ya existe para evitar errores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Crear el Trigger para que se ejecute DESPUÉS de cada insert en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
