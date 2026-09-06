import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, User, PlusCircle, Search, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ThemeToggle from './ThemeToggle';

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-base border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="Chambitas Logo" 
              width={44} 
              height={44} 
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-mono">
                  CHAMBITAS<span className="text-brand-primary">.</span>
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
          <div className="flex items-center gap-1 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/oficios/todos"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Directorio"
            >
              <Search className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-brand-primary" />
              <span className="hidden sm:inline">Directorio de Oficios</span>
            </Link>

            {user ? (
              <Link
                href={isAdmin ? "/admin" : "/portal/dashboard"}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 sm:px-3.5 py-2 rounded-lg shadow-sm border border-slate-700 transition-all ml-1 sm:ml-0"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-brand-primary" />
                <span className="hidden sm:inline">{isAdmin ? "Administración" : "Mi Panel"}</span>
                <span className="sm:hidden">{isAdmin ? "Admin" : "Panel"}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/portal/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                  title="Soy Técnico"
                >
                  <User className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-brand-accent" />
                  <span className="hidden sm:inline">Soy Técnico</span>
                </Link>

                <Link
                  href="/portal/login?mode=register"
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover px-3 sm:px-3.5 py-2 rounded-lg shadow-sm hover:shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all ml-1 sm:ml-0"
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Anunciar mi Oficio</span>
                  <span className="sm:hidden">Publicar</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
