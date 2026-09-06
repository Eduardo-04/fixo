'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Image as ImageIcon,
  ShieldCheck,
  QrCode,
  LogOut,
  ExternalLink,
  Wrench,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [slug, setSlug] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('slug, role')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        setSlug(profile.slug);
        setRole(profile.role);
      }
    }
    fetchProfile();
  }, []);

  const technicianNavItems = [
    { label: 'Resumen y Métricas', href: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'Mi Perfil y Zonas', href: '/portal/dashboard/perfil', icon: UserCheck },
    { label: 'Portafolio de Trabajos', href: '/portal/dashboard/portafolio', icon: ImageIcon },
    { label: 'Verificación INE', href: '/portal/dashboard/verificacion', icon: ShieldCheck },
    { label: 'Mi QR y Flyer', href: '/portal/dashboard/mi-qr', icon: QrCode },
  ];

  const clientNavItems = [
    { label: 'Técnicos Favoritos', href: '/portal/dashboard/favoritos', icon: Heart },
    { label: 'Mis Reseñas', href: '/portal/dashboard/mis-resenas', icon: MessageSquare },
    { label: 'Mi Perfil', href: '/portal/dashboard/perfil', icon: UserCheck },
  ];

  const navItems = role === 'client' ? clientNavItems : technicianNavItems;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/portal/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar de Navegación del Técnico */}
      <aside className="w-full md:w-64 bg-brand-base border-r border-slate-800 text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Header del Sidebar */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-mono font-bold text-sm tracking-tight">
                {role === 'client' ? 'MI CUENTA' : 'PORTAL TÉCNICO'}
              </span>
            </div>
          </div>

          {/* Enlaces */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {role === 'technician' && slug && (
            <Link
              href={`/t/${slug}`}
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <span>Ver mi perfil público</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
