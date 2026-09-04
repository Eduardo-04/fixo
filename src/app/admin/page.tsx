import Link from 'next/link';
import { ShieldCheck, Users, Eye, MessageCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { MOCK_TECHNICIANS, MOCK_BANNERS } from '@/lib/mock-data';

export default function AdminOverviewPage() {
  const totalTechnicians = MOCK_TECHNICIANS.length;
  const verifiedCount = MOCK_TECHNICIANS.filter((t) => t.verification_status === 'verified').length;
  const totalViews = MOCK_TECHNICIANS.reduce((acc, t) => acc + t.views_count, 0);
  const totalClicks = MOCK_TECHNICIANS.reduce((acc, t) => acc + t.whatsapp_clicks, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-mono">
          Panel de Administración Fixo
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervisión general de técnicos registrados, identificaciones por validar e inventario de banners publicitarios en Chiapas.
        </p>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Técnicos Registrados
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalTechnicians}</p>
          <p className="text-[11px] text-emerald-600 font-medium">100% en Tuxtla Gutiérrez</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            INEs Verificados
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">{verifiedCount}</p>
          <p className="text-[11px] text-slate-500">Credenciales aprobadas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vistas Acumuladas
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalViews}</p>
          <p className="text-[11px] text-slate-500">Tráfico de directorios y QR</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contactos WhatsApp
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalClicks}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Chambas conectadas</p>
        </div>
      </div>

      {/* Alerta de Verificaciones Pendientes */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Hay 2 identificaciones oficiales (INE) en espera de revisión
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
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
    </div>
  );
}
