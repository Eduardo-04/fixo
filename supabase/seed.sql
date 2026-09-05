-- Categories
INSERT INTO categories (id, name, slug, icon_name, description) VALUES
(1, 'Plomería', 'plomeria', 'Droplets', 'Especialistas en tuberías, fugas y bombas de agua.'),
(2, 'Electricidad', 'electricidad', 'Zap', 'Instalaciones, cableado y mantenimiento eléctrico.'),
(3, 'Climas (Minisplits)', 'climas-refrigeracion', 'Wind', 'Instalación y mantenimiento de aires acondicionados.'),
(4, 'Cerrajería', 'cerrajeria', 'Key', 'Apertura de chapas, cambio de combinaciones y duplicados.'),
(5, 'Albañilería', 'albanileria', 'Hammer', 'Construcción, remodelación y acabados en general.');

-- Technicians (Profiles)
-- Nota: En producción, estos IDs deben coincidir con los de auth.users creados por Supabase Auth.
INSERT INTO profiles (id, full_name, slug, phone_whatsapp, bio, experience_years, city, emits_cfdi, verification_status, is_pro, pro_expires_at, boost_expires_at, rating, reviews_count) VALUES
('f1a23b45-1111-4000-8000-000000000001', 'Carlos Morales', 'carlos-morales-plomeria', '529611234567', 'Soluciones rápidas y honestas. Especialista en hidroneumáticos.', 8, 'Tuxtla Gutiérrez', true, 'verified', true, '2025-12-31 23:59:59', '2026-12-31 23:59:59', 4.8, 34),
('f1a23b45-2222-4000-8000-000000000002', 'Roberto Díaz', 'roberto-diaz-electricidad', '529619876543', 'Trabajos eléctricos residenciales y comerciales garantizados.', 12, 'Tuxtla Gutiérrez', true, 'verified', true, '2026-11-30 23:59:59', null, 4.5, 12),
('f1a23b45-3333-4000-8000-000000000003', 'Felipe Santos', 'felipe-santos-climas', '529615554444', 'Tu minisplit siempre al 100%. Limpieza química profunda.', 5, 'Tuxtla Gutiérrez', false, 'verified', false, null, null, 5.0, 8);

-- Technician_Categories
INSERT INTO technician_categories (profile_id, category_id) VALUES
('f1a23b45-1111-4000-8000-000000000001', 1),
('f1a23b45-2222-4000-8000-000000000002', 2),
('f1a23b45-3333-4000-8000-000000000003', 3);

-- Banners
INSERT INTO banners (id, sponsor_name, description, target_url, banner_image_url, placement, aspect_ratio, ends_at) VALUES
('b1111111-1111-4000-8000-000000000000', 'Mandiola Materiales', 'Enseña tu perfil de Fixo y obtén 15% de descuento.', 'https://wa.me/529611239999', 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=1200&q=80', 'home_top', 'horizontal', '2026-12-31 23:59:59'),
('b2222222-2222-4000-8000-000000000000', 'Climas y Refrigeración Sur', 'Técnicos Fixo reciben precio preferencial.', 'https://wa.me/529611238888', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80', 'category_middle', 'horizontal', '2026-12-31 23:59:59'),
('b3333333-3333-4000-8000-000000000000', 'Ferretería El Tornillo Feliz', '¡Presenta tu credencial Fixo y llévate herramienta al 2x1!', 'https://wa.me/529611237777', 'https://i.pinimg.com/736x/af/f8/73/aff873db73eab2e8356df73674913efe.jpg', 'home_bottom', 'vertical', '2026-12-31 23:59:59'),
('b4444444-4444-4000-8000-000000000000', 'Cerrajería Master', 'Descuento en forjas y copias para afiliados a Fixo.', 'https://wa.me/529610000000', 'https://images.unsplash.com/photo-1558227096-7d07936a53cb?auto=format&fit=crop&w=800&q=80', 'home_bottom', 'vertical', '2026-12-31 23:59:59'),
('b5555555-5555-4000-8000-000000000000', 'Maderas y Triplay', 'Flete gratis en todas tus compras.', 'https://wa.me/529611111111', 'https://images.unsplash.com/photo-1540348705353-918900696954?auto=format&fit=crop&w=800&q=80', 'home_bottom', 'vertical', '2026-12-31 23:59:59');
