export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'technician' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type BannerPlacement = 'home_top' | 'category_middle' | 'footer';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  slug: string;
  phone_whatsapp: string; // e.g. +52961XXXXXXX
  bio: string | null;
  experience_years: number;
  city: string;
  state: string;
  neighborhoods_covered: string[];
  emits_cfdi: boolean;
  verification_status: VerificationStatus;
  is_pro: boolean;
  pro_expires_at: string | null;
  boost_expires_at: string | null;
  views_count: number;
  whatsapp_clicks: number;
  rating: number;
  reviews_count: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  description: string | null;
  created_at: string;
}

export interface TechnicianCategory {
  profile_id: string;
  category_id: number;
}

export interface PortfolioItem {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  item_type: 'image' | 'video';
  image_url: string;
  is_before_after: boolean;
  before_image_url: string | null;
  created_at: string;
}

export interface VerificationDocument {
  id: string;
  profile_id: string;
  document_type: 'ine_front' | 'ine_back' | 'address_proof';
  document_url: string;
  status: VerificationStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Banner {
  id: string;
  sponsor_name: string;
  description: string | null;
  target_url: string;
  banner_image_url: string;
  placement: BannerPlacement;
  aspect_ratio: 'horizontal' | 'vertical' | 'square';
  category_id: number | null;
  city: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; full_name: string; slug: string; phone_whatsapp: string };
        Update: Partial<Profile>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      technician_categories: {
        Row: TechnicianCategory;
        Insert: TechnicianCategory;
        Update: Partial<TechnicianCategory>;
      };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'created_at'>;
        Update: Partial<Omit<PortfolioItem, 'id' | 'created_at'>>;
      };
      verification_documents: {
        Row: VerificationDocument;
        Insert: Omit<VerificationDocument, 'id' | 'created_at'>;
        Update: Partial<Omit<VerificationDocument, 'id' | 'created_at'>>;
      };
      banners: {
        Row: Banner;
        Insert: Omit<Banner, 'id' | 'created_at' | 'impressions' | 'clicks'>;
        Update: Partial<Banner>;
      };
    };
    Functions: {
      increment_profile_views: {
        Args: { target_slug: string };
        Returns: void;
      };
      increment_whatsapp_clicks: {
        Args: { target_profile_id: string };
        Returns: void;
      };
      increment_banner_impression: {
        Args: { target_banner_id: string };
        Returns: void;
      };
      increment_banner_click: {
        Args: { target_banner_id: string };
        Returns: void;
      };
    };
  };
}
