import Link from 'next/link';
import { ShieldCheck, Zap, QrCode, MessageCircle, ArrowRight, CheckCircle2, Award, Sparkles } from 'lucide-react';
import SearchBar from '@/components/directory/SearchBar';
import CategoryCard from '@/components/directory/CategoryCard';
import TechnicianCard from '@/components/directory/TechnicianCard';
import SponsorBanner from '@/components/shared/SponsorBanner';
import SponsorBannerGrid from '@/components/shared/SponsorBannerGrid';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();

  // Fetch Categories
  const { data: categories = [] } = await supabase
    .from('categories')
    .select('*')
    .order('id');

  // Fetch Featured Technicians (Boosted first, then PRO)
  const { data: featuredTechnicians = [] } = await supabase
    .from('profiles')
    .select('*')
    .order('boost_expires_at', { ascending: false, nullsFirst: false })
    .order('is_pro', { ascending: false })
    .order('verification_status', { ascending: false })
    .order('views_count', { ascending: false })
    .limit(4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION INDUSTRIAL */}
      <section className="relative bg-brand-base text-white pt-12 pb-20 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        {/* Glows ambientales */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span>Técnicos verificados con INE en Tuxtla Gutiérrez y alrededores</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono leading-tight">
            La red de tus <span className="text-brand-primary">mejores chambas</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Encuentra plomeros, electricistas, técnicos de climas y cerrajeros confiables. 
            <strong className="text-white font-semibold"> Cero comisiones:</strong> cotiza y contrata directo por WhatsApp.
          </p>

          {/* BUSCADOR INTERACTIVO */}
          <div className="pt-4">
            <SearchBar />
          </div>

          {/* Micro credenciales */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Identidad Verificada con INE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Trato Directo sin Intermediarios</span>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-brand-primary" />
              <span>Tarjeta Digital con Código QR</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPONSOR BANNER (TOP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <SponsorBanner placement="home_top" />
      </section>

      {/* 3. CATEGORÍAS DE OFICIOS */}
      <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Directorio Local
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              Explora por Oficio o Especialidad
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Más de 6 oficios esenciales en el área metropolitana de Chiapas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* BANNER MIDDLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <SponsorBanner placement="category_middle" />
      </section>

      {/* 4. TÉCNICOS DESTACADOS (PRO & VERIFICADOS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recomendados de la Semana</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              Técnicos Verificados con Mayor Reputación
            </h2>
          </div>

          <Link
            href="/oficios/todos"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-primary-hover transition-colors"
          >
            <span>Ver todos los técnicos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredTechnicians?.map((technician) => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
        </div>
      </section>

      {/* 5. SECCIÓN ¿ERES TÉCNICO? (CALL TO ACTION INDUSTRIAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-base via-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-brand-primary/20 to-transparent pointer-events-none" />

          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-orange-500/10 border border-brand-primary/30 px-3 py-1 rounded-full">
              Únete a la red
            </span>

            <h3 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white leading-snug">
              ¿Trabajas en plomería, climas, electricidad o algún oficio?
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Consigue más clientes en tu colonia. Obtén tu propia <strong className="text-white">Tarjeta Digital con código QR</strong> para imprimir en tus volantes, comparte fotos de tus trabajos y recibe mensajes directos en tu WhatsApp personal.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Perfil web propio con link y QR</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Insignia oficial de INE Verificado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Estadísticas de vistas y clics a WhatsApp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Cero comisiones sobre tu mano de obra</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/portal/login?mode=register"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Crear mi Perfil Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-colors"
              >
                <span>Ya tengo cuenta</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER BOTTOM (GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <SponsorBannerGrid placement="home_bottom" />
      </section>
    </div>
  );
}
