'use client';

import { useState } from 'react';
import { Star, Heart, MessageSquare, X } from 'lucide-react';

export default function ProfileActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 w-full mt-4">
        <button
          onClick={() => {
            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl transition-colors text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Dejar Reseña</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 pt-2">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-brand-primary fill-brand-primary" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-mono">
                Inicia sesión para continuar
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Para garantizar la veracidad de las reseñas y poder guardar tus técnicos favoritos, necesitamos que te identifiques.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  alert('Simulación de inicio de sesión con Google exitosa.');
                  setIsModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-3.5 rounded-xl transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span>Continuar con Google</span>
              </button>
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold px-4 py-3.5 rounded-xl transition-all shadow-md"
              >
                <span>Crear Cuenta con Correo</span>
              </button>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-6">
              Nunca compartiremos tus datos con terceros.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
