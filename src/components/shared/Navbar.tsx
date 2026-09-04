import Link from 'next/link';
import { Wrench, ShieldCheck, User, PlusCircle, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-brand-base border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-amber-500 flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-mono">
                  FIXO<span className="text-brand-primary">.</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                  CHIS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block -mt-1">
                La red de tus mejores chambas
              </p>
            </div>
          </Link>

          {/* Enlaces y Acciones */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/oficios/todos"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-brand-primary" />
              <span className="hidden sm:inline">Directorio de Oficios</span>
              <span className="sm:hidden">Directorio</span>
            </Link>

            <Link
              href="/portal/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-brand-accent" />
              <span>Soy Técnico</span>
            </Link>

            <Link
              href="/portal/login?mode=register"
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover px-3.5 py-2 rounded-lg shadow-sm hover:shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Anunciar mi Oficio</span>
              <span className="sm:hidden">Publicar</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
