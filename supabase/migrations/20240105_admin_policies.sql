-- =========================================================================
-- FIXO: Políticas de Seguridad (RLS) para Super Admin y Storage
-- =========================================================================

-- 1. Crear el Bucket Privado para Documentos Sensibles
INSERT INTO storage.buckets (id, name, public)
VALUES ('private-docs', 'private-docs', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas Storage para private-docs
-- Técnicos pueden subir sus documentos
CREATE POLICY "Users insert private docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'private-docs' AND (auth.uid() = owner OR auth.uid()::text = (string_to_array(name, '/'))[1]) );

-- Técnicos pueden leer solo sus documentos
CREATE POLICY "Users view own private docs"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'private-docs' AND (auth.uid() = owner OR auth.uid()::text = (string_to_array(name, '/'))[1]) );

-- Admins pueden leer todos los documentos privados
CREATE POLICY "Admins view all private docs"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'private-docs' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
) );

-- 3. Políticas de Tabla para verification_documents
-- Permite a los administradores ver todos los documentos de verificación
DO $$ BEGIN
    CREATE POLICY "Admins can view all docs" ON verification_documents
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Permite a los administradores actualizar cualquier documento (Aprobar/Rechazar)
DO $$ BEGIN
    CREATE POLICY "Admins can update docs" ON verification_documents
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Políticas adicionales para profiles
-- Permite a los administradores modificar el perfil de cualquier técnico (para cambiar el estado a verificado)
DO $$ BEGIN
    CREATE POLICY "Admins can update profiles" ON profiles
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;
