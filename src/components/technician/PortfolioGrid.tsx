'use client';

import { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, X } from 'lucide-react';
import type { PortfolioItem } from '@/types/database';

interface PortfolioGridProps {
  items: PortfolioItem[];
  onDelete?: (id: string) => void;
}

export default function PortfolioGrid({ items, onDelete }: PortfolioGridProps) {
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

                {/* Selector Antes / Después (Segmented Control) */}
                {item.is_before_after && item.before_image_url && (
                  <div 
                    className="absolute top-3 left-3 flex items-center bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/50 shadow-lg"
                    onClick={(e) => e.stopPropagation()} // Prevenir que se abra el modal al clickear el selector
                  >
                    <button
                      type="button"
                      onClick={() => toggleBefore(item.id)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                        isShowingBefore 
                          ? 'bg-slate-700 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Antes
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBefore(item.id)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                        !isShowingBefore 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Después
                    </button>
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
                  
                  {onDelete ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Estás seguro de eliminar este trabajo de tu portafolio?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Eliminar
                    </button>
                  ) : (
                    <span>Chiapas</span>
                  )}
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
                <div 
                  className="flex items-center bg-slate-900/90 backdrop-blur-lg p-1.5 rounded-xl border border-slate-700/50 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => toggleBefore(selectedItem.id)}
                    className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      activeBeforeAfter[selectedItem.id]
                        ? 'bg-slate-700 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Antes
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBefore(selectedItem.id)}
                    className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      !activeBeforeAfter[selectedItem.id]
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Después
                  </button>
                </div>
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
