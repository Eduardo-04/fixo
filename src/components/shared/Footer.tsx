import Link from 'next/link';
import { ShieldCheck, Wrench, Heart, MapPin, QrCode } from 'lucide-react';
import DonationButton from './DonationButton';

export default function Footer() {
  return (
    <footer className="bg-brand-base border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Marca & Misión */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white font-mono">
                CHAMBITAS<span className="text-brand-primary">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              El directorio local y tarjeta digital de oficios para conectar directamente con técnicos verificados de Tuxtla Gutiérrez y Chiapas sin comisiones en mano de obra.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-brand-accent font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Verificación de Identidad Oficial (INE)</span>
            </div>
          </div>

          {/* Columna 2: Oficios Populares */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Oficios Populares
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/oficios/todos?q=climas" className="hover:text-brand-primary transition-colors">
                  Climas y Minisplits
                </Link>
              </li>
              <li>
                <Link href="/oficios/todos?q=plomeria" className="hover:text-brand-primary transition-colors">
                  Plomería y Fugas de Agua
                </Link>
              </li>
              <li>
                <Link href="/oficios/todos?q=electricidad" className="hover:text-brand-primary transition-colors">
                  Electricidad Residencial
                </Link>
              </li>
              <li>
                <Link href="/oficios/todos?q=cerrajeria" className="hover:text-brand-primary transition-colors">
                  Cerrajería 24 Horas
                </Link>
              </li>
              <li>
                <Link href="/oficios/todos?q=mecanica" className="hover:text-brand-primary transition-colors">
                  Mecánica a Domicilio
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Para Técnicos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Para Técnicos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/login?mode=register" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  <span>Crear mi Perfil Chambitas</span>
                  <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-1 rounded">Gratis</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/login" className="hover:text-brand-primary transition-colors">
                  Acceso al Dashboard
                </Link>
              </li>
              <li>
                <Link href="/portal/dashboard/mi-qr" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-brand-accent" />
                  <span>Descargar Tarjeta QR</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/dashboard/verificacion" className="hover:text-brand-primary transition-colors">
                  Insignia INE Verificado
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Cobertura Local */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Cobertura Inicial
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>Tuxtla Gutiérrez, Chiapas</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-block text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Panel de Administración
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Apoyo (Donaciones) */}
        <div className="pt-8 mb-8 border-t border-slate-800/50">
          <DonationButton />
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Chambitas. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Hecho con <Heart className="w-3 h-3 text-brand-primary inline fill-brand-primary" /> para los oficios de Chiapas.
          </p>
        </div>
      </div>
    </footer>
  );
}
