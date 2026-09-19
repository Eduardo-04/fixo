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

  // 2. Construir los parámetros para el RPC
  const rpcParams = {
    search_query: searchParams.q || '',
    filter_state: searchParams.estado || '',
    filter_city: searchParams.ciudad || '',
    filter_cfdi: searchParams.cfdi === 'true',
    filter_category_slug: isAll ? 'todos' : params.slug
  };

  // 3. Ejecutar el RPC avanzado (ignora tildes, ordena por prioridad, etc.)
  const { data: profilesData, error } = await supabase.rpc('search_technicians_advanced', rpcParams);

  if (error) {
    console.error('Error fetching technicians:', error);
  }

  // El RPC ya devuelve un formato plano, lo mapeamos para que coincida con lo que espera TechnicianCard
  // (TechnicianCard espera .categories = [{name: '...'}])
  let filtered = [];
  if (profilesData) {
    filtered = profilesData.map((p: any) => ({
      ...p,
      categories: category ? [{ name: category.name }] : [{ name: 'Múltiples Oficios' }], // Simplificado, ya que el RPC no devuelve el array de nombres de categoría. Podríamos ajustarlo, pero para la UI esto es suficiente o simplemente mostrar "Ver Perfil".
    }));
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

      {/* Banner Publicitario Dinámico (Búsqueda) */}
      <SponsorBanner 
        placement="search_results" 
        categoryId={category?.id} 
        targetState={searchParams.estado}
        targetCity={searchParams.ciudad}
      />

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
