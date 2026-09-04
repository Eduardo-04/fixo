'use client';

import { useState } from 'react';
import ImageUploader from '@/components/technician/ImageUploader';
import PortfolioGrid from '@/components/technician/PortfolioGrid';
import { MOCK_TECHNICIANS } from '@/lib/mock-data';
import { PlusCircle, Check } from 'lucide-react';
import type { PortfolioItem } from '@/types/database';

export default function PortfolioPage() {
  const tech = MOCK_TECHNICIANS[0];
  const [items, setItems] = useState<PortfolioItem[]>(tech.portfolio || []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) return;

    // Crear item temporal en vista previa
    const newItem: PortfolioItem = {
      id: 'temp-' + Date.now(),
      profile_id: tech.id,
      title,
      description,
      image_url: URL.createObjectURL(mainImage),
      is_before_after: isBeforeAfter,
      before_image_url: beforeImage ? URL.createObjectURL(beforeImage) : null,
      created_at: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setTitle('');
    setDescription('');
    setIsBeforeAfter(false);
    setMainImage(null);
    setBeforeImage(null);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          Portafolio de Trabajos
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Muestra fotos de tus reparaciones e instalaciones con soporte de "Antes y Después". Las fotos se comprimen en tu navegador antes de subirse.
        </p>
      </div>

      {/* Formulario de Subida con Compresión */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-brand-primary" />
          <span>Publicar Nuevo Trabajo Realizado</span>
        </h2>

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Trabajo publicado en tu perfil correctamente.</span>
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
              label="Foto del Trabajo Terminado (Principal)"
              onFileReady={(compressed) => setMainImage(compressed)}
            />

            {isBeforeAfter && (
              <ImageUploader
                label="Foto del Antes (Equipo dañado / Fuga previa)"
                onFileReady={(compressed) => setBeforeImage(compressed)}
              />
            )}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={!mainImage}
              className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Publicar Trabajo en mi Perfil
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Trabajos Existentes */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Tus Trabajos Publicados ({items.length})
        </h3>
        <PortfolioGrid items={items} />
      </div>
    </div>
  );
}
