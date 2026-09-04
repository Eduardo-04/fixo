'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { Banner, BannerPlacement } from '@/types/database';
import { trackBannerImpression, trackBannerClick } from '@/app/actions';
import { MOCK_BANNERS } from '@/lib/mock-data';

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

  useEffect(() => {
    if (!propBanner) {
      // Buscar banner coincidente en mocks si no viene de props
      const matched = MOCK_BANNERS.find(
        (b) => b.placement === placement && (!categoryId || b.category_id === categoryId)
      ) || MOCK_BANNERS.find((b) => b.placement === placement);
      setBanner(matched || null);
    }
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

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <a
        href={banner.target_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group block relative"
      >
        <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-900">
          <img
            src={banner.banner_image_url}
            alt={banner.sponsor_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badge Patrocinado */}
          <div className="absolute top-2.5 left-3 bg-brand-base/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700">
            Patrocinador Local • {banner.city}
          </div>

          {/* Nombre y llamada a la acción */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm sm:text-base drop-shadow-sm flex items-center gap-1.5">
                {banner.sponsor_name}
              </p>
              <p className="text-slate-300 text-xs hidden sm:block">
                Materiales, refacciones y promociones para tu hogar o negocio
              </p>
            </div>
            <div className="flex items-center gap-1 bg-brand-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm group-hover:bg-brand-primary-hover transition-colors shrink-0">
              <span>Ver Más</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
