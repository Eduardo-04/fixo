-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define custom types (Enums)
CREATE TYPE user_role AS ENUM ('technician', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE banner_placement AS ENUM ('home_top', 'category_middle', 'home_bottom');
CREATE TYPE banner_aspect_ratio AS ENUM ('horizontal', 'vertical', 'square');
CREATE TYPE portfolio_item_type AS ENUM ('image', 'video');

-- Create Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- Linked to auth.users.id
  role user_role DEFAULT 'technician'::user_role NOT NULL,
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0 NOT NULL,
  city TEXT DEFAULT 'Tuxtla Gutiérrez'::text NOT NULL,
  state TEXT DEFAULT 'Chiapas'::text NOT NULL,
  neighborhoods_covered TEXT[] DEFAULT '{}'::text[] NOT NULL,
  emits_cfdi BOOLEAN DEFAULT false NOT NULL,
  verification_status verification_status DEFAULT 'unverified'::verification_status NOT NULL,
  is_pro BOOLEAN DEFAULT false NOT NULL,
  pro_expires_at TIMESTAMP WITH TIME ZONE,
  boost_expires_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0 NOT NULL,
  whatsapp_clicks INTEGER DEFAULT 0 NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0.00 NOT NULL,
  reviews_count INTEGER DEFAULT 0 NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Technician_Categories (Many-to-Many)
CREATE TABLE technician_categories (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, category_id)
);

-- Create Portfolio Items Table
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type portfolio_item_type DEFAULT 'image'::portfolio_item_type NOT NULL,
  image_url TEXT NOT NULL,
  is_before_after BOOLEAN DEFAULT false NOT NULL,
  before_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Verification Documents Table
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'ine_front', 'ine_back', 'address_proof'
  document_url TEXT NOT NULL,
  status verification_status DEFAULT 'pending'::verification_status NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Banners Table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_name TEXT NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  banner_image_url TEXT NOT NULL,
  placement banner_placement NOT NULL,
  aspect_ratio banner_aspect_ratio DEFAULT 'horizontal'::banner_aspect_ratio NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  city TEXT DEFAULT 'Tuxtla Gutiérrez'::text NOT NULL,
  impressions INTEGER DEFAULT 0 NOT NULL,
  clicks INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create Policies (Read access for everyone, Write access for authenticated/owners)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);

CREATE POLICY "Technician categories are viewable by everyone." ON technician_categories FOR SELECT USING (true);
CREATE POLICY "Users can manage own categories." ON technician_categories FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Portfolio items are viewable by everyone." ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolio." ON portfolio_items FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own verification docs." ON verification_documents FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own verification docs." ON verification_documents FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Active banners are viewable by everyone." ON banners FOR SELECT USING (is_active = true);

-- Create RPC Functions for analytics
CREATE OR REPLACE FUNCTION increment_profile_views(target_slug text)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET views_count = views_count + 1
  WHERE slug = target_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(target_profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET whatsapp_clicks = whatsapp_clicks + 1
  WHERE id = target_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_banner_impression(target_banner_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE banners
  SET impressions = impressions + 1
  WHERE id = target_banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_banner_click(target_banner_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE banners
  SET clicks = clicks + 1
  WHERE id = target_banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
