import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, FileCheck2, MapPin, Star, Award, QrCode } from 'lucide-react';
import type { Profile, Category } from '@/types/database';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

interface TechnicianCardProps {
  technician: Profile & { categories?: Category[] };
  className?: string;
}

export default function TechnicianCard({ technician, className = '' }: TechnicianCardProps) {
  const isVerified = technician.verification_status === 'verified';
  const categoryNames = technician.categories?.map((c) => c?.name).filter(Boolean).join(', ') || 'Servicios Técnicos';

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex flex-col justify-between ${
        technician.is_pro ? 'ring-2 ring-brand-primary/20 bg-gradient-to-b from-orange-50/20 to-white dark:from-brand-primary/10 dark:to-slate-800/80' : ''
      } ${className}`}
    >
      <div>
        {/* Cabecera: Avatar + Badges */}
        <div className="flex items-start gap-4 mb-3.5">
          <Link href={`/t/${technician.slug}`} className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {technician.avatar_url ? (
                <img
                  src={technician.avatar_url}
                  alt={technician.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 text-white flex items-center justify-center font-bold text-xl font-mono">
                  {technician.full_name.charAt(0)}
                </div>
              )}
            </div>

            {technician.is_pro && (
              <span
                title="Técnico Destacado PRO"
                className="absolute -bottom-1.5 -right-1.5 bg-brand-primary text-white p-1 rounded-full shadow-sm ring-2 ring-white"
              >
                <Award className="w-3.5 h-3.5" />
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              {/* Badge Verificado INE */}
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-badge">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>INE Verificado</span>
                </span>
              )}

              {/* Badge CFDI */}
              {technician.emits_cfdi && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  <FileCheck2 className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Factura (CFDI)</span>
                </span>
              )}
            </div>

            <Link href={`/t/${technician.slug}`}>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-brand-primary dark:hover:text-brand-primary transition-colors truncate">
                {technician.full_name}
              </h3>
            </Link>

            <p className="text-xs font-medium text-brand-primary line-clamp-1">
              {categoryNames}
            </p>
          </div>
        </div>

        {/* Bio corta */}
        {technician.bio && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {technician.bio}
          </p>
        )}

        {/* Experiencia y Zonas */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {technician.experience_years} {technician.experience_years === 1 ? 'año' : 'años'} de exp.
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600 truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span>{technician.city}, Chis.</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{technician.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-slate-400">({technician.reviews_count || 0} reseñas)</span>
          </div>

          {technician.neighborhoods_covered && technician.neighborhoods_covered.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
              <span className="text-slate-400 shrink-0">Zonas:</span>
              <span className="truncate">{technician.neighborhoods_covered.slice(0, 3).join(', ')}</span>
              {technician.neighborhoods_covered.length > 3 && (
                <span className="text-slate-400">+{technician.neighborhoods_covered.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
        <Link
          href={`/t/${technician.slug}`}
          className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <QrCode className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Ver Perfil</span>
        </Link>

        <div className="flex-1">
          <WhatsAppButton
            phone={technician.phone_whatsapp}
            technicianName={technician.full_name}
            profileId={technician.id}
            variant="compact"
            className="w-full py-2"
          />
        </div>
      </div>
    </div>
  );
}
