'use client';

import { useState } from 'react';
import { PlusCircle, Eye, MousePointerClick, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { MOCK_BANNERS } from '@/lib/mock-data';
import type { Banner } from '@/types/database';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);

  const [sponsorName, setSponsorName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [placement, setPlacement] = useState<'home_top' | 'category_middle' | 'footer'>('home_top');
  const [aspectRatio, setAspectRatio] = useState<'horizontal' | 'vertical' | 'square'>('horizontal');
  const [endsAt, setEndsAt] = useState('2026-12-31');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: Banner = {
      id: 'banner-' + Date.now(),
      sponsor_name: sponsorName,
      target_url: targetUrl,
      banner_image_url: imageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      placement,
      aspect_ratio: aspectRatio,
      category_id: null,
      city: 'Tuxtla Gutiérrez',
      impressions: 0,
      clicks: 0,
      is_active: true,
      starts_at: new Date().toISOString().split('T')[0],
      ends_at: endsAt,
      created_at: new Date().toISOString(),
    };

    setBanners([newBanner, ...banners]);
    setSponsorName('');
    setTargetUrl('');
    setImageUrl('');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-mono">
          Banners de Patrocinadores Locales
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gestiona los espacios publicitarios locales (ferreterías, distribuidores de refacciones de climas, madererías) y monitorea sus impresiones y clics.
        </p>
      </div>

      {/* Formulario de Alta de Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-brand-primary" />
          <span>Dar de Alta Nuevo Patrocinador</span>
        </h2>

        <form onSubmit={handleAddBanner} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nombre del Negocio Patrocinador
              </label>
              <input
                type="text"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Ej. Mandiola Materiales"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ubicación del Banner (Placement)
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              >
                <option value="home_top">Home Superior (Principal)</option>
                <option value="category_middle">Directorio / Intermedio de Categoría</option>
                <option value="footer">Pie de Página</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Formato de Imagen (Proporción)
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              >
                <option value="horizontal">Horizontal (Banner Ancho)</option>
                <option value="square">Cuadrado (Bloque)</option>
                <option value="vertical">Vertical (Banner Alto)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Enlace de Destino (WhatsApp o Web)
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://wa.me/52961... o https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL de la Imagen del Banner
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... o enlace a Storage"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Publicar Banner
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Banners Activos con Métricas */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Banners Activos ({banners.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-28 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                  <img src={banner.banner_image_url} alt={banner.sponsor_name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{banner.sponsor_name}</h4>
                  <p className="text-xs text-slate-400">
                    Posición: <strong className="text-brand-primary">{banner.placement}</strong> • Vence: {banner.ends_at}
                  </p>
                  <a
                    href={banner.target_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-0.5"
                  >
                    <span>Ver enlace</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Impresiones</span>
                  <span className="text-sm font-black text-slate-900 font-mono">{banner.impressions}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Clics</span>
                  <span className="text-sm font-black text-emerald-600 font-mono">{banner.clicks}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">CTR</span>
                  <span className="text-sm font-black text-brand-primary font-mono">
                    {((banner.clicks / (banner.impressions || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-slate-100 mt-2 sm:mt-0 w-full sm:w-auto">
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
