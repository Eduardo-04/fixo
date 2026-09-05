-- Añadir nuevas categorías populares a la tabla
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('Reparación de Celulares y Tablets', 'reparacion-de-celulares', 'Mantenimiento preventivo, cambio de pantallas y baterías de dispositivos móviles.'),
  ('Albañilería y Construcción', 'albanileria', 'Remodelaciones, obra negra, acabados, impermeabilización y construcción en general.')
ON CONFLICT (slug) DO NOTHING;
