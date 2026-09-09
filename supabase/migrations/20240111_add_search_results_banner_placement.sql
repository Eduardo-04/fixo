-- Añadir nuevo tipo de placement para banners de búsqueda
ALTER TYPE banner_placement ADD VALUE IF NOT EXISTS 'search_results';
