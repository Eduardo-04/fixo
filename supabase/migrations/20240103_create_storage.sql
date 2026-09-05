-- 1. Crear el Bucket de almacenamiento público (ignorar si ya existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar el acceso público para lectura de las fotos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public-media' );

-- 3. Permitir que los usuarios autenticados suban sus propias fotos
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public-media' );

-- 4. Permitir que los usuarios autenticados modifiquen sus propias fotos
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'public-media' );

-- 5. Permitir que los usuarios autenticados borren sus fotos
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'public-media' );
