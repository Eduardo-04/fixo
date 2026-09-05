-- Permitir todas las operaciones (CRUD) temporalmente para la tabla de banners
-- Esto es necesario para poder agregar y editar banners desde el panel sin estar autenticado aún

CREATE POLICY "Enable ALL for everyone" ON banners FOR ALL USING (true);
