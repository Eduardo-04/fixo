import Link from 'next/link';
import { ShieldCheck, Image as ImageIcon, Users, ArrowLeft, BarChart3 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-orange-500/20 px-2 py-0.5 rounded">
              Super Admin Fixo
            </span>
            <h2 className="text-lg font-black font-mono mt-1">Panel de Control</h2>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-brand-primary" />
              <span>Resumen General</span>
            </Link>
            <Link
              href="/admin/verificaciones"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aprobación de INE</span>
            </Link>
            <Link
              href="/admin/banners"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Banners Patrocinadores</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al sitio público</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
