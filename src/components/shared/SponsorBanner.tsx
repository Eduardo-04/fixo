'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, X } from 'lucide-react';
import type { Banner, BannerPlacement } from '@/types/database';
import { trackBannerImpression, trackBannerClick } from '@/app/actions';
import { createClient } from '@/lib/supabase/client';

interface SponsorBannerProps {
  placement: BannerPlacement;
  categoryId?: number;
  banner?: Banner;
  className?: string;
}

export default function SponsorBanner({
  placement,
  categoryId,
  banner: propBanner,
  className = '',
}: SponsorBannerProps) {
  const [banner, setBanner] = useState<Banner | null>(propBanner || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadBanner() {
      if (!propBanner) {
        let query = supabase
          .from('banners')
          .select('*')
          .eq('placement', placement)
          .eq('is_active', true);
          
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }
        
        const { data, error } = await query.limit(1).single();
        if (data) {
          setBanner(data);
        }
      }
    }
    
    loadBanner();
  }, [placement, categoryId, propBanner]);

  useEffect(() => {
    if (banner) {
      trackBannerImpression(banner.id);
    }
  }, [banner]);

  if (!banner) return null;

  const handleClick = () => {
    trackBannerClick(banner.id);
  };

  const layoutClasses = {
    horizontal: 'aspect-[21/9] w-full max-h-[300px]',
    square: 'aspect-square w-full max-w-sm mx-auto',
    vertical: 'aspect-[3/4] w-full max-w-xs mx-auto'
  };

  const containerClass = banner.aspect_ratio ? layoutClasses[banner.aspect_ratio] : layoutClasses.horizontal;

  return (
    <>
      <div className={`relative overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 transform hover:-translate-y-1 ${containerClass} ${className}`}>
        <button
          onClick={() => {
            handleClick();
            setIsModalOpen(true);
          }}
          className="group block relative h-full w-full text-left"
        >
          <div className="relative h-full w-full overflow-hidden bg-slate-900">
            <img
              src={banner.banner_image_url}
              alt={banner.sponsor_name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

            {/* Badge Patrocinado */}
            <div className="absolute top-3 left-4 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/20 shadow-lg">
              Patrocinador Local • <span className="text-brand-primary/90">{banner.city}</span>
            </div>

            {/* Nombre y llamada a la acción */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div className="max-w-[70%]">
                <p className="text-white font-extrabold text-base sm:text-lg drop-shadow-md leading-tight group-hover:text-brand-primary transition-colors duration-300">
                  {banner.sponsor_name}
                </p>
                <p className="text-slate-300/90 text-xs sm:text-sm mt-0.5 hidden sm:block line-clamp-1">
                  {banner.description || 'Patrocinador oficial en Fixo'}
                </p>
              </div>
              
              <div className="flex items-center gap-1.5 bg-brand-primary/90 backdrop-blur-sm border border-brand-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-brand-primary/30 group-hover:bg-brand-primary group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all duration-300 shrink-0 transform group-hover:scale-105">
                <span>Ver Promo</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/60 rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800 rounded-full transition-all backdrop-blur-md border border-slate-700/50 hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full shrink-0 flex justify-center bg-slate-950">
              <img
                src={banner.banner_image_url}
                alt={banner.sponsor_name}
                referrerPolicy="no-referrer"
                className="w-full max-h-[50vh] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-1.5 block drop-shadow-lg">
                  Patrocinador Oficial
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-mono leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {banner.sponsor_name}
                </h3>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 overflow-y-auto">
              <p className="text-base text-slate-300 leading-relaxed mb-8 font-medium">
                {banner.description || 'Visita nuestro sitio para más información y beneficios.'}
              </p>

              <a
                href={banner.target_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="group w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-4 py-4 rounded-2xl transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-1"
              >
                <span>Obtener Beneficio / Contactar</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              
              <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <span className="flex-1 h-px bg-slate-800"></span>
                <span>{banner.city}</span>
                <span className="flex-1 h-px bg-slate-800"></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
