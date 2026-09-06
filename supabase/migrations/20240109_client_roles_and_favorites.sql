-- 1. NOTA IMPORTANTE: Postgre requiere que agregar un ENUM se haga en una transacción separada.
-- PRIMERO corre esta línea sola en el editor (cópiala y ejecútala antes que todo lo demás):
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'client';

-- Cambiar el rol por defecto de nuevos usuarios a 'client'
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'client';

-- Hacer que phone_whatsapp y otros campos de técnico sean opcionales para que los clientes puedan registrarse sin ellos
ALTER TABLE profiles ALTER COLUMN phone_whatsapp DROP NOT NULL;

-- 2. Eliminar la tabla de reseñas vieja si existe, para crear la nueva versión segura
DROP TABLE IF EXISTS public.reviews CASCADE;

-- Crear la nueva tabla de reseñas ligada a usuarios autenticados
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- Perfil del Técnico
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- Perfil del Cliente
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Asegurar que un cliente solo pueda dejar una reseña por técnico
    UNIQUE(profile_id, reviewer_id)
);

-- 3. Crear tabla de favoritos
CREATE TABLE public.favorite_technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    technician_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(client_id, technician_id)
);

-- 4. Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_technicians ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de RLS para Reseñas
DO $$ BEGIN
    CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 6. Políticas de RLS para Favoritos
DO $$ BEGIN
    CREATE POLICY "Users can view own favorites" ON favorite_technicians FOR SELECT USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own favorites" ON favorite_technicians FOR INSERT WITH CHECK (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own favorites" ON favorite_technicians FOR DELETE USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. Trigger para recalcular el promedio de calificación
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE profiles
        SET 
            reviews_count = (SELECT COUNT(*) FROM reviews WHERE profile_id = OLD.profile_id),
            rating_average = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE profile_id = OLD.profile_id)
        WHERE id = OLD.profile_id;
        RETURN OLD;
    ELSE
        UPDATE profiles
        SET 
            reviews_count = (SELECT COUNT(*) FROM reviews WHERE profile_id = NEW.profile_id),
            rating_average = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE profile_id = NEW.profile_id)
        WHERE id = NEW.profile_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_changed ON reviews;
CREATE TRIGGER on_review_changed
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_profile_rating();
