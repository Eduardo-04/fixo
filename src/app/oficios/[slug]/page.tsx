import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MOCK_CATEGORIES, MOCK_TECHNICIANS } from '@/lib/mock-data';
import TechnicianCard from '@/components/directory/TechnicianCard';
import SponsorBanner from '@/components/shared/SponsorBanner';
import SearchBar from '@/components/directory/SearchBar';
import Link from 'next/link';
import { ArrowLeft, Filter, Users } from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { q?: string; colonia?: string; cfdi?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  if (params.slug === 'todos') {
    return {
      title: 'Todos los Técnicos y Oficios en Chiapas | Fixo',
      description: 'Explora todos los prestadores de servicios técnicos verificados en Tuxtla Gutiérrez y Chiapas.',
    };
  }

  const category = MOCK_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return { title: 'Oficio no encontrado | Fixo' };

  return {
    title: `${category.name} en Tuxtla Gutiérrez | Técnicos Verificados | Fixo`,
    description: `Encuentra técnicos certificados en ${category.name} en Tuxtla Gutiérrez, Chiapas. Cotiza por WhatsApp y verifica credenciales oficiales.`,
  };
}

export default function CategoryDirectoryPage({ params, searchParams }: CategoryPageProps) {
  const isAll = params.slug === 'todos';
  const category = isAll ? null : MOCK_CATEGORIES.find((c) => c.slug === params.slug);

  if (!isAll && !category) {
    notFound();
  }

  // Filtrado de técnicos
  let filtered = MOCK_TECHNICIANS.filter((t) => {
    // Categoría
    if (!isAll && category) {
      const hasCategory = t.categories?.some((c) => c.slug === category.slug);
      if (!hasCategory) return false;
    }

    // Filtro por término
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase();
      const matchName = t.full_name.toLowerCase().includes(q);
      const matchBio = t.bio?.toLowerCase().includes(q);
      const matchCat = t.categories?.some((c) => c.name.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchCat) return false;
    }

    // Filtro por colonia
    if (searchParams.colonia && searchParams.colonia !== 'Todas las colonias') {
      const hasNeighborhood = t.neighborhoods_covered.some(
        (n) => n.toLowerCase() === searchParams.colonia?.toLowerCase()
      );
      if (!hasNeighborhood) return false;
    }

    // Filtro por CFDI
    if (searchParams.cfdi === 'true' && !t.emits_cfdi) {
      return false;
    }

    return true;
  });

  // Ordenamiento prioritario: is_pro -> verified -> views
  filtered.sort((a, b) => {
    if (a.is_pro && !b.is_pro) return -1;
    if (!a.is_pro && b.is_pro) return 1;
    if (a.verification_status === 'verified' && b.verification_status !== 'verified') return -1;
    if (a.verification_status !== 'verified' && b.verification_status === 'verified') return 1;
    return b.views_count - a.views_count;
  });

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
        initialNeighborhood={searchParams.colonia}
        initialCfdiOnly={searchParams.cfdi === 'true'}
      />

      {/* BANNER PATROCINADOR INTERMEDIO */}
      <SponsorBanner placement="category_middle" categoryId={category?.id} />

      {/* Lista de Técnicos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tech) => (
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
            Intenta quitando el filtro de factura CFDI o cambiando la colonia seleccionada.
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
