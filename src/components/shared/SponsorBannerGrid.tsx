'use client';

import { useEffect, useState } from 'react';
import type { Banner, BannerPlacement } from '@/types/database';
import { MOCK_BANNERS } from '@/lib/mock-data';
import SponsorBanner from './SponsorBanner';

interface SponsorBannerGridProps {
  placement: BannerPlacement;
  categoryId?: number;
}

export default function SponsorBannerGrid({ placement, categoryId }: SponsorBannerGridProps) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Filtrar todos los banners activos que coincidan con la ubicación
    let matched = MOCK_BANNERS.filter((b) => b.placement === placement && b.is_active);
    
    if (categoryId) {
      const categoryMatched = matched.filter((b) => b.category_id === categoryId);
      if (categoryMatched.length > 0) {
        matched = categoryMatched;
      }
    }
    
    setBanners(matched);
  }, [placement, categoryId]);

  if (banners.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
          Patrocinadores Locales
        </span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <SponsorBanner key={banner.id} banner={banner} placement={placement} className="h-full" />
        ))}
      </div>
    </div>
  );
}
