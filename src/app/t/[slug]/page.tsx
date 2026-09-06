import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
  MapPin,
  Calendar,
  Briefcase,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Star,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import ProfileActions from '@/components/technician/ProfileActions';
import QRCodeCard from '@/components/technician/QRCodeCard';
import PortfolioGrid from '@/components/technician/PortfolioGrid';
import ReviewsSection from '@/components/technician/ReviewsSection';
import FavoriteButton from '@/components/technician/FavoriteButton';
import { trackProfileView } from '@/app/actions';

interface TechnicianProfileProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: TechnicianProfileProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: tech } = await supabase
    .from('profiles')
    .select('*, technician_categories(categories(name))')
    .eq('slug', params.slug)
    .eq('role', 'technician')
    .single();

  if (!tech) return { title: 'Técnico no encontrado | Chambitas' };

  const categoryNames = tech.technician_categories?.map((tc: any) => tc.categories.name).join(', ') || 'Servicios Técnicos';

  return {
    title: `${tech.full_name} - ${categoryNames} en Tuxtla Gutiérrez | Chambitas`,
    description: `${tech.bio || 'Técnico verificado en Tuxtla Gutiérrez.'} Contacta directo por WhatsApp o escanea su tarjeta digital QR.`,
    openGraph: {
      title: `${tech.full_name} | ${categoryNames} en Chambitas`,
      description: `Especialista con ${tech.experience_years || 1} años de experiencia en Tuxtla Gutiérrez. Cotiza por WhatsApp.`,
      images: tech.avatar_url ? [{ url: tech.avatar_url }] : [],
    },
  };
}

export default async function TechnicianPublicProfile({ params }: TechnicianProfileProps) {
  const supabase = createClient();

  // Fetch complete profile with categories and portfolio items
  const { data: tech } = await supabase
    .from('profiles')
    .select(`
      *,
      technician_categories(
        categories(name)
      ),
      portfolio_items(*),
      reviews!reviews_profile_id_fkey(
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name)
      )
    `)
    .eq('slug', params.slug)
    .eq('role', 'technician')
    .single();

  if (!tech) {
    notFound();
  }

  // Incremento atómico en background del contador de visitas (Server Action)
  await trackProfileView(tech.slug);

  const isVerified = tech.verification_status === 'verified';
  const categoryNames = tech.technician_categories?.map((tc: any) => tc.categories?.name).join(' • ') || 'Servicios Técnicos';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Botón flotante de WhatsApp en móviles/escritorio */}
      <WhatsAppButton
        phone={tech.phone_whatsapp}
        technicianName={tech.full_name}
        profileId={tech.id}
        variant="floating"
      />

      {/* Top Banner de Retorno */}
      <div className="bg-brand-base border-b border-slate-800 text-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Directorio</span>
          </Link>
          <span className="text-[11px] text-slate-400 font-mono">
            ID: {tech.slug}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TARJETA PRINCIPAL DEL TÉCNICO */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-100 border-2 border-brand-primary/30 shadow-md">
                {tech.avatar_url ? (
                  <img
                    src={tech.avatar_url}
                    alt={tech.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 dark:bg-slate-950 text-white flex items-center justify-center font-bold text-3xl font-mono">
                    {tech.full_name.charAt(0)}
                  </div>
                )}
              </div>

              {tech.is_pro && (
                <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow border-2 border-white">
                  PRO
                </div>
              )}
            </div>

            {/* Datos Principales */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>✓ Identidad Verificada (INE)</span>
                  </span>
                )}

                {tech.emits_cfdi && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Factura Disponible (CFDI)</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {tech.full_name}
              </h1>

              <p className="text-sm font-bold text-brand-primary">
                {categoryNames}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">{tech.rating_average?.toFixed(1) || '5.0'}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                  {tech.reviews_count || 0} reseñas verificadas
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 mt-3">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{tech.experience_years || 1} años</strong> de exp.
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{tech.city || 'Tuxtla Gutiérrez'}, Chis.</span>
                </span>
              </div>
            </div>

            {/* CTA WhatsApp Principal y Acciones */}
            <div className="w-full sm:w-auto sm:min-w-[200px] shrink-0 pt-4 sm:pt-0 flex flex-col gap-2">
              <div className="flex gap-2">
                <WhatsAppButton
                  phone={tech.phone_whatsapp}
                  technicianName={tech.full_name}
                  profileId={tech.id}
                  variant="primary"
                  className="flex-1"
                />
                <FavoriteButton technicianId={tech.id} />
              </div>
              <ProfileActions />
            </div>
          </div>

          {/* Biografía / Descripción del Servicio */}
          {tech.bio && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Acerca de mis servicios
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {tech.bio}
              </p>
            </div>
          )}

          {/* Colonias con Cobertura */}
          {tech.neighborhoods_covered && tech.neighborhoods_covered.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Zonas y Colonias con Cobertura Inmediata
              </h3>
              <div className="flex flex-wrap gap-2">
                {tech.neighborhoods_covered.map((col: string) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200"
                  >
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{col}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DOS COLUMNAS: PORTAFOLIO Y CÓDIGO QR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portafolio de Trabajos (2 columnas) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                  Trabajos Realizados
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fotografías comprobables de reparaciones e instalaciones
                </p>
              </div>
              <span className="text-xs font-semibold bg-orange-50 text-brand-primary px-2.5 py-1 rounded-lg border border-orange-200">
                {tech.portfolio_items?.length || 0} fotos
              </span>
            </div>

            <PortfolioGrid items={tech.portfolio_items || []} />
          </div>

          {/* Tarjeta Digital & QR Descargable (1 columna) */}
          <div className="space-y-6">
            <QRCodeCard
              slug={tech.slug}
              technicianName={tech.full_name}
              specialty={categoryNames}
              phone={tech.phone_whatsapp}
              emitsCfdi={tech.emits_cfdi}
              isVerified={isVerified}
              avatarUrl={tech.avatar_url}
              rating={tech.rating_average}
              reviewsCount={tech.reviews_count}
              jobsCount={tech.portfolio_items?.length || 0}
            />

            {/* Garantía de Trato Directo */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Trato 100% Directo</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                En Chambitas no cobramos comisiones por mano de obra. Todo el acuerdo, pago y garantía lo tratas directamente con el técnico por WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE RESEÑAS */}
        <div id="reviews-section" className="pt-8 border-t border-slate-200">
          <ReviewsSection 
            profileId={tech.id} 
            initialReviews={tech.reviews?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || []} 
          />
        </div>
      </div>
    </div>
  );
}
