'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Eye, MousePointerClick, Calendar, ExternalLink, Sparkles, Pencil } from 'lucide-react';
import type { Banner } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form states
  const [sponsorName, setSponsorName] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [placement, setPlacement] = useState<'home_top' | 'category_middle' | 'home_bottom'>('home_top');
  const [aspectRatio, setAspectRatio] = useState<'horizontal' | 'vertical' | 'square'>('horizontal');
  const [endsAt, setEndsAt] = useState('2026-12-31');

  const supabase = createClient();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setBanners(data);
    }
    setIsLoading(false);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBannerId(banner.id);
    setSponsorName(banner.sponsor_name);
    setDescription(banner.description || '');
    setTargetUrl(banner.target_url);
    setImageUrl(banner.banner_image_url);
    setPlacement(banner.placement);
    setAspectRatio(banner.aspect_ratio);
    // Extraer solo la fecha de YYYY-MM-DD
    const endDate = banner.ends_at ? banner.ends_at.split('T')[0] : '2026-12-31';
    setEndsAt(endDate);
    
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingBannerId(null);
    setSponsorName('');
    setDescription('');
    setTargetUrl('');
    setImageUrl('');
    setPlacement('home_top');
    setAspectRatio('horizontal');
    setEndsAt('2026-12-31');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bannerData = {
      sponsor_name: sponsorName,
      description: description || null,
      target_url: targetUrl,
      banner_image_url: imageUrl || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      placement,
      aspect_ratio: aspectRatio,
      category_id: null,
      city: 'Tuxtla Gutiérrez',
      ends_at: endsAt ? `${endsAt}T23:59:59Z` : '2026-12-31T23:59:59Z',
      is_active: true,
    };

    if (editingBannerId) {
      // Update
      const { error } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', editingBannerId);
        
      if (!error) {
        alert('Banner actualizado con éxito');
        fetchBanners();
        resetForm();
      } else {
        alert('Error al actualizar el banner: ' + error.message);
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('banners')
        .insert(bannerData);
        
      if (!error) {
        alert('Banner creado con éxito');
        fetchBanners();
        resetForm();
      } else {
        alert('Error al crear el banner: ' + error.message);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este banner permanentemente? Perderás las estadísticas de clics e impresiones.')) {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
        
      if (!error) {
        setBanners(banners.filter(b => b.id !== id));
      } else {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    if (!error) {
      setBanners(banners.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-mono">
          Banners de Patrocinadores Locales
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gestiona los espacios publicitarios locales, monitorea sus métricas y edita sus enlaces sin perder el historial.
        </p>
      </div>

      {/* Formulario de Alta/Edición de Banner */}
      <div className={`bg-white rounded-3xl border ${editingBannerId ? 'border-brand-primary shadow-md shadow-brand-primary/10' : 'border-slate-200'} p-6 sm:p-8 shadow-sm transition-all`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {editingBannerId ? (
              <>
                <Pencil className="w-5 h-5 text-brand-primary" />
                <span>Editar Patrocinador</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 text-brand-primary" />
                <span>Dar de Alta Nuevo Patrocinador</span>
              </>
            )}
          </h2>
          {editingBannerId && (
            <button onClick={resetForm} className="text-xs font-bold text-slate-500 hover:text-slate-800 underline">
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                Descripción / Promoción
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. 15% de descuento enseñando tu perfil Fixo"
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
                <option value="home_bottom">Pie de Página (Cuadrícula)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Formato de Imagen
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
                Enlace de Destino (URL o WhatsApp)
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://wa.me/52961..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL de la Imagen
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Fecha de Finalización
              </label>
              <input
                type="date"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${editingBannerId ? 'bg-slate-900 hover:bg-black' : 'bg-brand-primary hover:bg-brand-primary-hover'} text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50`}
            >
              {isSubmitting ? 'Guardando...' : editingBannerId ? 'Guardar Cambios' : 'Publicar Banner'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Banners Activos con Métricas */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Banners Activos ({banners.length})
        </h3>

        {isLoading ? (
          <p className="text-sm text-slate-500">Cargando banners desde Supabase...</p>
        ) : banners.length === 0 ? (
          <p className="text-sm text-slate-500">No hay banners publicados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl border ${!banner.is_active ? 'border-dashed border-slate-300 opacity-60' : 'border-slate-200'} p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-28 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                    <img src={banner.banner_image_url} alt={banner.sponsor_name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {banner.sponsor_name}
                      {!banner.is_active && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase">Pausado</span>}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Posición: <strong className="text-brand-primary">{banner.placement}</strong> • Vence: {banner.ends_at.split('T')[0]}
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
                    onClick={() => handleToggleActive(banner.id, banner.is_active)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    {banner.is_active ? 'Pausar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    Editar
                  </button>
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
        )}
      </div>
    </div>
  );
}
