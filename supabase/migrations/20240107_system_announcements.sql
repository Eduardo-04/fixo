-- =========================================================================
-- FIXO: Sistema de Anuncios Globales para Técnicos
-- =========================================================================

-- 1. Crear tipo de anuncio
DO $$ BEGIN
    CREATE TYPE announcement_type AS ENUM ('info', 'warning', 'success', 'ad');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Crear tabla de anuncios
CREATE TABLE IF NOT EXISTS system_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type announcement_type DEFAULT 'info' NOT NULL,
    link_url TEXT,
    link_text TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;

-- Lectura pública para cualquier usuario autenticado (técnicos)
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view active announcements" 
    ON system_announcements FOR SELECT 
    TO authenticated
    USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Admins pueden leer todos (activos o no)
DO $$ BEGIN
    CREATE POLICY "Admins view all announcements" 
    ON system_announcements FOR SELECT 
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Solo administradores pueden crear/modificar/borrar anuncios
DO $$ BEGIN
    CREATE POLICY "Admins can manage announcements" 
    ON system_announcements FOR ALL 
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Datos de prueba
INSERT INTO system_announcements (title, message, type, link_url, link_text, is_active)
VALUES (
    '¡Bienvenido al nuevo panel de Fixo!',
    'Estamos mejorando la plataforma para ti. Ahora puedes descargar tu Tarjeta QR directamente desde aquí para conseguir más clientes.',
    'success',
    '/portal/dashboard/mi-qr',
    'Ver mi QR',
    true
) ON CONFLICT DO NOTHING;
