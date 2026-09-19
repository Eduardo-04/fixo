'use client';

import { useEffect, useState } from 'react';
import type { Banner, BannerPlacement } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import SponsorBanner from './SponsorBanner';

interface SponsorBannerGridProps {
  placement: BannerPlacement;
  categoryId?: number;
  targetState?: string;
  targetCity?: string;
}

export default function SponsorBannerGrid({ placement, categoryId, targetState, targetCity }: SponsorBannerGridProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBanners() {
      let query = supabase
        .from('banners')
        .select('*')
        .eq('placement', placement)
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      // Filtro Geográfico: Si se especifica ciudad, buscar banners de esa ciudad o nacionales (null)
      if (targetCity && targetCity !== 'Todas las ciudades') {
        query = query.or(`target_city.is.null,target_city.eq.${targetCity}`);
      } else if (targetState && targetState !== 'Todos los estados') {
        query = query.or(`target_state.is.null,target_state.eq.${targetState}`);
      }

      const { data, error } = await query;
      
      if (data) {
        // Ordenar primero locales, luego nacionales
        data.sort((a, b) => {
          if (a.target_city && !b.target_city) return -1;
          if (!a.target_city && b.target_city) return 1;
          return 0;
        });
        setBanners(data);
      }
    }
    
    fetchBanners();
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
