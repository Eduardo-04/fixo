'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/technician/ImageUploader';
import PortfolioGrid from '@/components/technician/PortfolioGrid';
import { PlusCircle, Check } from 'lucide-react';
import type { PortfolioItem } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  const FREE_LIMIT = 6;
  const PRO_LIMIT = 30;
  
  // Determina el límite actual basado en si es PRO o no
  const currentLimit = isPro ? PRO_LIMIT : FREE_LIMIT;
  const hasReachedLimit = items.length >= currentLimit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadKey, setUploadKey] = useState(Date.now());
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Cargar trabajos
        const { data } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setItems(data as PortfolioItem[]);

        // Cargar estado PRO
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', user.id)
          .single();
          
        if (profile) setIsPro(profile.is_pro);
      }
      setLoading(false);
    }
    loadPortfolio();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage || !userId || hasReachedLimit) return;

    setIsUploading(true);
    const supabase = createClient();
    
    try {
      // 1. Subir imagen principal
      const mainPath = `${userId}/${Date.now()}_main.webp`;
      const { data: mainUpload, error: mainError } = await supabase.storage
        .from('public-media')
        .upload(mainPath, mainImage);
        
      if (mainError) throw mainError;
      const mainUrl = supabase.storage.from('public-media').getPublicUrl(mainPath).data.publicUrl;

      // 2. Subir imagen del antes (si aplica)
      let beforeUrl = null;
      if (isBeforeAfter && beforeImage) {
        const beforePath = `${userId}/${Date.now()}_before.webp`;
        const { data: beforeUpload, error: beforeError } = await supabase.storage
          .from('public-media')
          .upload(beforePath, beforeImage);
          
        if (beforeError) throw beforeError;
        beforeUrl = supabase.storage.from('public-media').getPublicUrl(beforePath).data.publicUrl;
      }

      // 3. Insertar en base de datos
      const { data: newItem, error: insertError } = await supabase
        .from('portfolio_items')
        .insert({
          profile_id: userId,
          title,
          description,
          image_url: mainUrl,
          is_before_after: isBeforeAfter,
          before_image_url: beforeUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Actualizar vista
      setItems([newItem as PortfolioItem, ...items]);
      setTitle('');
      setDescription('');
      setIsBeforeAfter(false);
      setMainImage(null);
      setBeforeImage(null);
      setUploadKey(Date.now()); // Forzar reinicio de ImageUploader
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      console.error('Error al subir trabajo:', error);
      alert('Error al guardar el trabajo. Asegúrate de haber configurado Supabase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Error al eliminar el trabajo.');
    } else {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Hubo un error al generar el link de pago. Inténtalo más tarde.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Cargando portafolio...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          Portafolio de Trabajos
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Muestra fotos de tus reparaciones e instalaciones con soporte de "Antes y Después". Las fotos se comprimen en tu navegador antes de subirse a la nube.
        </p>
      </div>

      {/* Formulario de Subida con Compresión */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-primary" />
            <span>Publicar Nuevo Trabajo Realizado</span>
          </h2>
          
          {/* Contador de Límite */}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${isPro ? 'bg-amber-100 text-amber-700' : hasReachedLimit ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
            {items.length} de {currentLimit} fotos permitidas {isPro && '(Plan PRO)'}
          </span>
        </div>

        {hasReachedLimit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-sm font-bold text-red-800 mb-1">¡Límite de Portafolio Alcanzado!</h3>
            <p className="text-xs text-red-600 mb-3">
              {isPro 
                ? `Como usuario PRO, has alcanzado el límite máximo de ${PRO_LIMIT} trabajos. Para mantener la velocidad de la plataforma, por favor elimina un trabajo antiguo si deseas subir uno nuevo.` 
                : `Las cuentas gratuitas tienen un límite de ${FREE_LIMIT} trabajos. Si deseas subir hasta ${PRO_LIMIT} fotos y destacar tu perfil en las búsquedas, actualiza a Chambitas PRO.`}
            </p>
            
            {!isPro && (
              <button 
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="bg-[#009EE3] hover:bg-[#0089C7] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isCheckoutLoading ? 'Generando link seguro...' : 'Obtener Chambitas PRO por $150 MXN'}
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Trabajo guardado en tu perfil correctamente.</span>
          </div>
        )}

        <form onSubmit={handleAddItem} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Título del Trabajo
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Cambio de compresor minisplit 1.5 ton"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="beforeAfterToggle"
                checked={isBeforeAfter}
                onChange={(e) => setIsBeforeAfter(e.target.checked)}
                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary h-5 w-5"
              />
              <label htmlFor="beforeAfterToggle" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Incluir foto comparativa (Antes y Después)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Descripción Breve
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué problema tenía el cliente y cómo lo resolviste..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>

          {/* Subidores de fotos con compresión client-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ImageUploader
              key={`main-${uploadKey}`}
              label="Foto del Trabajo Terminado (Principal)"
              onFileReady={(compressed) => setMainImage(compressed)}
            />

            {isBeforeAfter && (
              <ImageUploader
                key={`before-${uploadKey}`}
                label="Foto del Antes (Equipo dañado / Fuga previa)"
                onFileReady={(compressed) => setBeforeImage(compressed)}
              />
            )}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={!mainImage || isUploading || hasReachedLimit}
              className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isUploading ? 'Subiendo imagen...' : 'Publicar Trabajo en mi Perfil'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Trabajos Existentes */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Tus Trabajos Publicados ({items.length})
        </h3>
        {items.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl text-slate-500 text-sm">
            Aún no has publicado trabajos. Sube el primero arriba para destacarte ante los clientes.
          </div>
        ) : (
          <PortfolioGrid items={items} onDelete={handleDeleteItem} />
        )}
      </div>
    </div>
  );
}
