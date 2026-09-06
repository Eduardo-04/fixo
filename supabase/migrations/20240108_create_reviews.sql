-- Crear tabla de reseñas
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Todo mundo puede ver las reseñas
DO $$ BEGIN
    CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Cualquier persona puede crear una reseña (anon o authenticated)
DO $$ BEGIN
    CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Crear función para recalcular el promedio del técnico cuando se inserta una nueva reseña
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        reviews_count = (
            SELECT COUNT(*) FROM reviews WHERE profile_id = NEW.profile_id
        ),
        rating_average = (
            SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE profile_id = NEW.profile_id
        )
    WHERE id = NEW.profile_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear Trigger
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_profile_rating();
