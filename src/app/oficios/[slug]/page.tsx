import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import TechnicianCard from '@/components/directory/TechnicianCard';
import SponsorBanner from '@/components/shared/SponsorBanner';
import SearchBar from '@/components/directory/SearchBar';
import Link from 'next/link';
import { ArrowLeft, Filter, Users } from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { q?: string; estado?: string; ciudad?: string; cfdi?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  if (params.slug === 'todos') {
    return {
      title: 'Todos los Técnicos y Oficios en Chiapas | Chambitas',
      description: 'Explora todos los prestadores de servicios técnicos verificados en Tuxtla Gutiérrez y Chiapas.',
    };
  }

  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) return { title: 'Oficio no encontrado | Chambitas' };

  return {
    title: `${category.name} en Tuxtla Gutiérrez | Técnicos Verificados | Chambitas`,
    description: `Encuentra técnicos certificados en ${category.name} en Tuxtla Gutiérrez, Chiapas. Cotiza por WhatsApp y verifica credenciales oficiales.`,
  };
}

export default async function CategoryDirectoryPage({ params, searchParams }: CategoryPageProps) {
  const isAll = params.slug === 'todos';
  const supabase = createClient();
  
  // 1. Obtener información de la categoría actual
  let category = null;
  if (!isAll) {
    const { data: cat } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!cat) notFound();
    category = cat;
  }

  // 2. Construir la consulta a Supabase
  // Traemos perfiles con su categoría asociada
  let query = supabase
    .from('profiles')
    .select(`
      *,
      technician_categories!inner(
        categories(id, name, slug)
      )
    `)
    .eq('role', 'technician');

  // Filtro de categoría
  if (!isAll && category) {
    query = query.eq('technician_categories.category_id', category.id);
  }

  // Filtros de UI
  if (searchParams.estado && searchParams.estado !== 'Todos los estados') {
    query = query.ilike('state', searchParams.estado);
  }
  
  if (searchParams.ciudad && searchParams.ciudad !== 'Todas las ciudades') {
    query = query.ilike('city', searchParams.ciudad);
  }
  
  if (searchParams.cfdi === 'true') {
    query = query.eq('emits_cfdi', true);
  }

  // Ejecutar query
  const { data: profilesData } = await query;
  
  // 3. Post-procesamiento y Filtro de Búsqueda (Texto)
  let filtered = [];
  
  if (profilesData) {
    // Mapear la respuesta al formato que espera TechnicianCard
    filtered = profilesData.map((p: any) => ({
      ...p,
      categories: p.technician_categories?.map((tc: any) => tc.categories) || [],
    }));

    // Búsqueda por palabra clave (nombre, bio, categoría)
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase();
      filtered = filtered.filter((t: any) => {
        const matchName = t.full_name?.toLowerCase().includes(q);
        const matchBio = t.bio?.toLowerCase().includes(q);
        const matchCat = t.categories?.some((c: any) => c.name?.toLowerCase().includes(q));
        return matchName || matchBio || matchCat;
      });
    }

    // Ordenamiento prioritario: is_pro -> verified -> views
    filtered.sort((a: any, b: any) => {
      if (a.is_pro && !b.is_pro) return -1;
      if (!a.is_pro && b.is_pro) return 1;
      if (a.verification_status === 'verified' && b.verification_status !== 'verified') return -1;
      if (a.verification_status !== 'verified' && b.verification_status === 'verified') return 1;
      return (b.views_count || 0) - (a.views_count || 0);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Navegación de retorno y Título */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {isAll ? 'Todos los Técnicos y Oficios' : category?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isAll
                ? 'Directorio completo de prestadores de servicios en Tuxtla Gutiérrez'
                : category?.description}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold shadow-sm self-start sm:self-auto">
            <Users className="w-4 h-4 text-brand-primary" />
            <span>{filtered.length} técnicos disponibles</span>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <SearchBar
        initialQuery={searchParams.q}
        initialState={searchParams.estado}
        initialCity={searchParams.ciudad}
        initialCfdiOnly={searchParams.cfdi === 'true'}
      />

      {/* BANNER PATROCINADOR INTERMEDIO */}
      <SponsorBanner placement="category_middle" categoryId={category?.id} />

      {/* Lista de Técnicos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tech: any) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-primary flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron técnicos con estos filtros
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Intenta quitando el filtro de factura CFDI o cambiando la ciudad seleccionada.
          </p>
          <Link
            href={isAll ? '/oficios/todos' : `/oficios/${params.slug}`}
            className="inline-block bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Limpiar filtros
          </Link>
        </div>
      )}
    </div>
  );
}
