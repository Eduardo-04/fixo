import Link from 'next/link';
import { ShieldCheck, Users, Eye, MessageCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminOverviewPage() {
  const supabase = createClient();

  // Obtener estadísticas reales
  const { data: profiles } = await supabase.from('profiles').select('verification_status, views_count, whatsapp_clicks, role').eq('role', 'technician');
  
  // Obtener cantidad de documentos pendientes únicos (agrupados por profile_id, o simplemente contamos todos y dividimos, o consultamos perfiles en pending)
  const { count: pendingVerifications } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'pending');

  let totalTechnicians = 0;
  let verifiedCount = 0;
  let totalViews = 0;
  let totalClicks = 0;

  if (profiles) {
    totalTechnicians = profiles.length;
    verifiedCount = profiles.filter((p) => p.verification_status === 'verified').length;
    totalViews = profiles.reduce((acc, p) => acc + (p.views_count || 0), 0);
    totalClicks = profiles.reduce((acc, p) => acc + (p.whatsapp_clicks || 0), 0);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
          Panel de Administración Fixo
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Supervisión general de técnicos registrados, identificaciones por validar e inventario en Chiapas.
        </p>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Técnicos Registrados
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{totalTechnicians}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">En plataforma</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            INEs Verificados
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{verifiedCount}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Credenciales aprobadas</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Vistas Acumuladas
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{totalViews}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Tráfico de directorios y QR</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Contactos WhatsApp
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{totalClicks}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Chambas conectadas</p>
        </div>
      </div>

      {/* Alerta de Verificaciones Pendientes */}
      {(pendingVerifications || 0) > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-500">
                Hay {pendingVerifications} identificaciones oficiales (INE) en espera de revisión
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-600 mt-0.5">
                Valida los datos y autoriza la insignia de confianza para activar el badge oficial.
              </p>
            </div>
          </div>

          <Link
            href="/admin/verificaciones"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors shrink-0"
          >
            Revisar Ahora
          </Link>
        </div>
      )}
    </div>
  );
}
