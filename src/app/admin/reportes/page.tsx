'use client';

import { useState, useEffect } from 'react';
import { Flag, Loader2, Mail, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ReportItem {
  id: string;
  profile_id: string;
  reason: string;
  details: string | null;
  contact_email: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  profiles: {
    full_name: string;
    slug: string;
    phone_whatsapp: string;
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('profile_reports')
      .select(`
        *,
        profiles (full_name, slug, phone_whatsapp)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setReports(data as any);
    }
    setLoading(false);
  }

  const markAsResolved = async (reportId: string) => {
    setActionLoading(reportId);
    const supabase = createClient();
    await supabase.from('profile_reports').update({ status: 'resolved' }).eq('id', reportId);
    
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' } : r
    ));
    setActionLoading(null);
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      estafa: 'Estafa / Robo',
      mal_trabajo: 'Mal Trabajo',
      no_se_presento: 'No se presentó',
      perfil_falso: 'Perfil Falso',
      conducta_inapropiada: 'Conducta Inapropiada',
      otro: 'Otro'
    };
    return labels[reason] || reason;
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
          Reportes de Usuarios
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gestiona las denuncias que los clientes hacen sobre los técnicos en la plataforma.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
            <Flag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Bandeja Limpia</h3>
          <p className="text-xs text-slate-500">No hay reportes de perfiles por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div 
              key={report.id}
              className={`bg-white dark:bg-slate-950 rounded-2xl border p-5 shadow-sm space-y-4 ${
                report.status === 'resolved' 
                  ? 'border-slate-200 dark:border-slate-800 opacity-60' 
                  : 'border-red-200 dark:border-red-900/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      report.status === 'resolved' 
                        ? 'bg-slate-100 text-slate-500' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {report.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      {getReasonLabel(report.reason)}
                    </h3>
                    {report.details && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic border-l-2 border-slate-200 dark:border-slate-800 pl-3 py-1">
                        "{report.details}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 min-w-[200px]">
                  <div>
                    <strong className="block text-slate-500 mb-0.5">Técnico Reportado:</strong>
                    <Link href={`/t/${report.profiles?.slug}`} target="_blank" className="text-brand-primary font-bold hover:underline flex items-center gap-1">
                      {report.profiles?.full_name} <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-slate-500 mt-0.5">{report.profiles?.phone_whatsapp}</p>
                  </div>
                  {report.contact_email && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <strong className="block text-slate-500 mb-0.5">Correo del Cliente:</strong>
                      <a href={`mailto:${report.contact_email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {report.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {report.status !== 'resolved' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => markAsResolved(report.id)}
                    disabled={actionLoading === report.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
                  >
                    {actionLoading === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Marcar como Resuelto
                  </button>
                  {/* El botón de banear podría llevar a Supabase directo o ser una futura Server Action */}
                  <a
                    href="https://supabase.com/dashboard/project/_/auth/users"
                    target="_blank"
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Banear Técnico en Supabase
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
