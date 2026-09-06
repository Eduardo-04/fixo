'use client';

import { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, X } from 'lucide-react';
import type { PortfolioItem } from '@/types/database';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [activeBeforeAfter, setActiveBeforeAfter] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Este técnico aún no ha publicado fotos de sus trabajos anteriores.
        </p>
      </div>
    );
  }

  const toggleBefore = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveBeforeAfter((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const isShowingBefore = activeBeforeAfter[item.id] || false;
          const currentImage = isShowingBefore && item.before_image_url ? item.before_image_url : item.image_url;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-56 sm:h-64 w-full bg-slate-900 group">
                <img
                  src={currentImage}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Tag Antes / Después */}
                {item.is_before_after && item.before_image_url && (
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleBefore(item.id, e)}
                      className="flex items-center gap-1.5 bg-brand-base/90 hover:bg-brand-base text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-700 shadow-md transition-all active:scale-95"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Ver {isShowingBefore ? 'Resultado Final' : 'Antes de la Reparación'}</span>
                    </button>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isShowingBefore
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-emerald-500/90 text-white'
                      }`}
                    >
                      {isShowingBefore ? 'Antes' : 'Después (Terminado)'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Trabajo Realizado
                  </span>
                  <span>Chiapas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Imagen */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors z-50"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-full max-h-[90vh] flex flex-col items-center">
            {selectedItem.is_before_after && selectedItem.before_image_url && (
              <div className="absolute top-4 flex justify-center w-full z-50">
                <button
                  type="button"
                  onClick={(e) => toggleBefore(selectedItem.id, e)}
                  className="flex items-center gap-2 bg-brand-base/90 hover:bg-brand-base text-white text-sm font-bold px-5 py-2 rounded-full backdrop-blur-md border border-slate-700 shadow-2xl transition-all active:scale-95"
                >
                  <ArrowLeftRight className="w-4 h-4 text-brand-primary" />
                  <span>Cambiar a {activeBeforeAfter[selectedItem.id] ? 'Resultado Final' : 'Antes de la Reparación'}</span>
                </button>
              </div>
            )}
            <img 
              src={activeBeforeAfter[selectedItem.id] && selectedItem.before_image_url ? selectedItem.before_image_url : selectedItem.image_url} 
              alt="Vista expandida" 
              className={`max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl ${selectedItem.is_before_after ? 'cursor-pointer' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedItem.is_before_after && selectedItem.before_image_url) {
                  toggleBefore(selectedItem.id);
                }
              }}
            />
            {selectedItem.is_before_after && selectedItem.before_image_url && (
              <p className="absolute bottom-4 text-white/70 text-xs bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                Toca la imagen para alternar
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
