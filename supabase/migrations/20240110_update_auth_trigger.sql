-- Reemplazar la función de trigger para leer el rol desde meta_data o asignar 'client' por defecto
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
BEGIN
  -- Extraer los datos del meta_data (pasados desde el frontend en signUp)
  user_name := COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario ' || substr(new.id::text, 1, 6));
  user_phone := new.raw_user_meta_data->>'phone'; -- Ahora puede ser null
  
  -- Extraer y validar el rol solicitado, por defecto 'client'
  IF (new.raw_user_meta_data->>'role' = 'technician') THEN
      user_role_val := 'technician';
  ELSIF (new.raw_user_meta_data->>'role' = 'admin') THEN
      user_role_val := 'admin';
  ELSE
      user_role_val := 'client';
  END IF;

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
    user_role_val,
    'Tuxtla Gutiérrez',
    'Chiapas'
  );
  
  RETURN new;
END;
$$;
