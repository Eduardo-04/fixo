-- =========================================================================
-- FIXO: LA RED DE TUS MEJORES CHAMBAS
-- Esquema de Base de Datos PostgreSQL / Supabase
-- Migración Inicial completa con Tablas, Enums, RLS y Funciones RPC
-- =========================================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('technician', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE banner_placement AS ENUM ('home_top', 'category_middle', 'footer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA: PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'technician' NOT NULL,
    full_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    phone_whatsapp TEXT NOT NULL, -- Formato: +52961XXXXXXX
    bio TEXT,
    experience_years INT DEFAULT 1,
    city TEXT DEFAULT 'Tuxtla Gutiérrez' NOT NULL,
    state TEXT DEFAULT 'Chiapas' NOT NULL,
    neighborhoods_covered TEXT[] DEFAULT '{}',
    emits_cfdi BOOLEAN DEFAULT false NOT NULL,
    verification_status verification_status DEFAULT 'unverified' NOT NULL,
    is_pro BOOLEAN DEFAULT false NOT NULL,
    pro_expires_at TIMESTAMPTZ,
    views_count INT DEFAULT 0 NOT NULL,
    whatsapp_clicks INT DEFAULT 0 NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA: CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TABLA: TECHNICIAN_CATEGORIES (Junction)
CREATE TABLE IF NOT EXISTS technician_categories (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, category_id)
);

-- 5. TABLA: PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    is_before_after BOOLEAN DEFAULT false NOT NULL,
    before_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. TABLA: VERIFICATION DOCUMENTS (Private Storage)
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL, -- 'ine_front', 'ine_back', 'address_proof'
    document_url TEXT NOT NULL,
    status verification_status DEFAULT 'pending' NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. TABLA: LOCAL SPONSOR BANNERS
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_name TEXT NOT NULL,
    target_url TEXT NOT NULL,
    banner_image_url TEXT NOT NULL,
    placement banner_placement NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    city TEXT DEFAULT 'Tuxtla Gutiérrez' NOT NULL,
    impressions INT DEFAULT 0 NOT NULL,
    clicks INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    starts_at DATE DEFAULT CURRENT_DATE NOT NULL,
    ends_at DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. RPC ATOMIC COUNTERS
CREATE OR REPLACE FUNCTION increment_profile_views(target_slug TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE profiles
    SET views_count = views_count + 1
    WHERE slug = target_slug;
END;
$$;

CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(target_profile_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE profiles
    SET whatsapp_clicks = whatsapp_clicks + 1
    WHERE id = target_profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_banner_impression(target_banner_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE banners
    SET impressions = impressions + 1
    WHERE id = target_banner_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_banner_click(target_banner_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE banners
    SET clicks = clicks + 1
    WHERE id = target_banner_id;
END;
$$;

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_categories ENABLE ROW LEVEL SECURITY;

-- Lectura pública
DO $$ BEGIN
    CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read technician_categories" ON technician_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read active banners" ON banners FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Modificaciones autenticadas
DO $$ BEGIN
    CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users insert own portfolio" ON portfolio_items FOR INSERT WITH CHECK (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users delete own portfolio" ON portfolio_items FOR DELETE USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users upload verification docs" ON verification_documents FOR INSERT WITH CHECK (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users view own docs" ON verification_documents FOR SELECT USING (auth.uid() = profile_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 10. DATOS SEMILLA (SEED DATA)
INSERT INTO categories (name, slug, icon_name, description) VALUES
('Plomería e Instalaciones', 'plomeria', 'Wrench', 'Reparación de fugas, tinacos, bombas de agua, calentadores y tuberías.'),
('Electricidad Residencial', 'electricidad', 'Zap', 'Cortocircuitos, cableado, centros de carga, iluminación y balance de fases.'),
('Climas y Refrigeración', 'climas-refrigeracion', 'Wind', 'Mantenimiento de minisplits, recarga de gas, instalación y reparación de refrigeradores.'),
('Mecánica y Frenos', 'mecanica', 'Car', 'Afinación automotriz, suspensión, frenos y escaneo computarizado a domicilio.'),
('Carpintería y Muebles', 'carpinteria', 'Hammer', 'Closets, cocinas integrales, puertas, barniz y reparación de muebles de madera.'),
('Cerrajería 24/7', 'cerrajeria', 'KeyRound', 'Aperturas residenciales y automotrices, duplicados, chapas de seguridad.')
ON CONFLICT (slug) DO NOTHING;

-- 11. BUCKETS DE STORAGE (Documentación / Configuración)
-- 1. 'public-media' (avatars, portfolio images, banners) -> Public read
-- 2. 'private-docs' (INEs, private verifications) -> Private, read restricted to admin & owner
