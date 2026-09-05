import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Eye, MessageCircle, TrendingUp, ShieldCheck, QrCode, ArrowUpRight, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardSummaryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/portal/login');
  }

  const { data: tech } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: announcements } = await supabase
    .from('system_announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);
    
  const activeAnnouncement = announcements?.[0];

  if (!tech) {
    // Si la cuenta existe en auth pero no en profiles (ej. cuentas viejas fallidas), lo auto-creamos:
    const userMeta = user.user_metadata || {};
    const fallbackName = userMeta.full_name || 'Técnico ' + user.id.substring(0, 6);
    const fallbackSlug = fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fallbackName,
      slug: fallbackSlug,
      phone_whatsapp: userMeta.phone || '0000000000',
      role: 'technician',
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
    });

    if (insertError) {
      return (
        <div className="p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error Crítico al Recuperar Perfil</h2>
          <p className="text-slate-600">
            No se pudo reparar tu cuenta de forma automática ({insertError.message}).
          </p>
        </div>
      );
    }
    
    // Recargar la página para mostrar el dashboard con el perfil recién creado
    redirect('/portal/dashboard');
  }

  const conversionRate = ((tech.whatsapp_clicks / (tech.views_count || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Sistema de Anuncios Globales */}
      {activeAnnouncement && (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
          activeAnnouncement.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
          activeAnnouncement.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
          activeAnnouncement.type === 'ad' ? 'bg-purple-50 border-purple-200 text-purple-900' :
          'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                activeAnnouncement.type === 'success' ? 'bg-emerald-500' :
                activeAnnouncement.type === 'warning' ? 'bg-amber-500' :
                activeAnnouncement.type === 'ad' ? 'bg-purple-500' :
                'bg-blue-500'
              }`}></span>
              {activeAnnouncement.title}
            </h3>
            <p className="text-xs mt-1 opacity-90">{activeAnnouncement.message}</p>
          </div>
          {activeAnnouncement.link_url && (
            <Link 
              href={activeAnnouncement.link_url}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm ${
                activeAnnouncement.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                activeAnnouncement.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                activeAnnouncement.type === 'ad' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {activeAnnouncement.link_text || 'Ver más'}
            </Link>
          )}
        </div>
      )}

      {/* Saludo y Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              Hola, {tech.full_name.split(' ')[0]} 👋
            </h1>
            {tech.is_pro && (
              <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Aquí está el rendimiento de tu tarjeta digital y perfil en Tuxtla Gutiérrez.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/dashboard/mi-qr"
            className="flex items-center gap-1.5 bg-brand-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-brand-primary-hover transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Ver mi Tarjeta QR</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas Atómicas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Vistas de Perfil */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vistas de Perfil
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {tech.views_count}
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Personas que abrieron tu enlace o QR</span>
          </p>
        </div>

        {/* Clics de WhatsApp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contactos a WhatsApp
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {tech.whatsapp_clicks}
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conversaciones iniciadas para cotizar</span>
          </p>
        </div>

        {/* Tasa de Conversión */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tasa de Conversión
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-primary flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {conversionRate}%
          </p>
          <p className="text-[11px] text-slate-500">
            De cada 100 visitas, {Math.round(parseFloat(conversionRate))} te escriben
          </p>
        </div>
      </div>

      {/* Estado de la Verificación Oficial INE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Insignia Oficial de Verificación
              </h3>
              <p className="text-xs text-slate-500">
                Tu credencial oficial (INE) está aprobada y activa.
              </p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
            ✓ Verificado
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          Los técnicos con INE verificado aparecen en las primeras posiciones del buscador de Fixo y generan un <strong>3.2x más de contactos por WhatsApp</strong> al brindar mayor confianza a familias y comercios de Chiapas.
        </p>
      </div>
    </div>
  );
}
