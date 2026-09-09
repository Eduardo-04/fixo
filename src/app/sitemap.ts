import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chambitas.shop';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Crear cliente de supabase solo de lectura para el build
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // 1. Rutas Estáticas
  const routes = [
    '',
    '/privacidad',
    '/terminos',
    '/portal/login',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Rutas de Oficios (Categorías)
  const { data: categories } = await supabase.from('categories').select('slug');
  const categoryRoutes = (categories || []).map((cat) => ({
    url: `${URL}/oficios/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Rutas de Perfiles de Técnicos
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug, updated_at')
    .eq('role', 'technician');

  const profileRoutes = (profiles || []).map((profile) => ({
    url: `${URL}/t/${profile.slug}`,
    lastModified: profile.updated_at || new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...routes, ...categoryRoutes, ...profileRoutes];
}
