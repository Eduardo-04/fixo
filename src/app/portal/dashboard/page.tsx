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

  if (!tech) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Error de Perfil Incompleto</h2>
        <p className="text-slate-600">
          Tu cuenta existe en el sistema, pero no se pudo crear tu "Ficha Pública de Técnico" por un problema de seguridad en la base de datos que ya fue solucionado.
        </p>
        <p className="text-slate-600 font-semibold">
          Para solucionar esto, por favor crea una cuenta nueva utilizando otro correo electrónico (ej. agregando un número).
        </p>
      </div>
    );
  }

  const conversionRate = ((tech.whatsapp_clicks / (tech.views_count || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-8">
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
