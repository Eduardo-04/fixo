-- Migration 00003: Allow authenticated users to insert their own profile during registration

-- Permitir a un usuario insertar su propio perfil en la tabla profiles
CREATE POLICY "Users can insert own profile." ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- NOTA: Este archivo debe ejecutarse manualmente en el panel de Supabase
-- o mediante la CLI si se está usando localmente.
