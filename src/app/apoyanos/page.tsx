'use client';

import Link from 'next/link';
import { Heart, Coffee, Star, Shield, ArrowLeft, Wrench, Hammer, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DonatePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDonate = (amount: number) => {
    let url = '';
    if (amount === 10) url = 'https://mpago.la/2S5kQ4k';
    if (amount === 50) url = 'https://mpago.la/2vqDA4e';
    if (amount === 100) url = 'https://mpago.la/2PbftLG';
    
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Animación CSS para la lluvia de herramientas */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rain {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .rain-element {
          position: absolute;
          animation: rain linear infinite;
          opacity: 0;
          color: rgba(255, 255, 255, 0.4);
        }
      `}} />

      {/* Herramientas lloviendo (Solo se renderizan en cliente para evitar hydration mismatch) */}
      {mounted && Array.from({ length: 15 }).map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const duration = `${Math.random() * 10 + 10}s`;
        const delay = `-${Math.random() * 20}s`;
        const size = Math.random() * 20 + 20; // 20px a 40px
        const icons = [Wrench, Hammer, PenTool];
        const Icon = icons[Math.floor(Math.random() * icons.length)];

        return (
          <Icon 
            key={i} 
            className="rain-element z-0" 
            style={{ 
              left, 
              animationDuration: duration, 
              animationDelay: delay,
              width: size,
              height: size
            }} 
          />
        );
      })}

      {/* Background decorations */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-primary/20 blur-[100px] z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-500/20 blur-[100px] z-0" />
      
      <div className="max-w-xl w-full relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-8 group bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Header */}
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center rotate-3 transition-transform hover:rotate-6">
              <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center -rotate-6 shadow-sm">
              <Star className="w-4 h-4 text-brand-base fill-brand-base" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 font-mono mb-4 tracking-tight">
            Apoya a Fixo
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
            Nuestro objetivo es mantener Fixo como un espacio <strong>100% gratuito y sin comisiones</strong> para todos los técnicos de Tuxtla Gutiérrez. Si nuestra plataforma te ha ayudado, invítanos un café.
          </p>

          {/* Opciones de Donación */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleDonate(10)}
              className="w-full group relative flex items-center p-4 bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-brand-primary rounded-2xl transition-all shadow-sm hover:shadow-md hover:shadow-brand-primary/10"
            >
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6 text-slate-700" />
              </div>
              <div className="text-left ml-4 flex-1">
                <h3 className="font-bold text-slate-900">Un café exprés</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Gestos que alegran el día</p>
              </div>
              <div className="text-xl font-black text-brand-primary font-mono bg-brand-primary/10 px-3 py-1 rounded-lg">
                $10
              </div>
            </button>

            <button
              onClick={() => handleDonate(50)}
              className="w-full group relative flex items-center p-4 bg-rose-50 hover:bg-white border-2 border-rose-200 hover:border-rose-500 rounded-2xl transition-all shadow-sm hover:shadow-md hover:shadow-rose-500/10"
            >
              <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm rotate-3">
                Recomendado
              </div>
              <div className="w-12 h-12 bg-white rounded-xl border border-rose-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
              <div className="text-left ml-4 flex-1">
                <h3 className="font-bold text-slate-900">Impulso Local</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Ayuda a pagar los servidores</p>
              </div>
              <div className="text-xl font-black text-rose-600 font-mono bg-rose-100 px-3 py-1 rounded-lg">
                $50
              </div>
            </button>

            <button
              onClick={() => handleDonate(100)}
              className="w-full group relative flex items-center p-4 bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-amber-500 rounded-2xl transition-all shadow-sm hover:shadow-md hover:shadow-amber-500/10"
            >
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-left ml-4 flex-1">
                <h3 className="font-bold text-slate-900">Patrocinador Estrella</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Contribución enorme al proyecto</p>
              </div>
              <div className="text-xl font-black text-amber-600 font-mono bg-amber-100 px-3 py-1 rounded-lg">
                $100
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <Shield className="w-4 h-4 text-emerald-500" />
            Pagos procesados 100% seguros por Mercado Pago
          </div>
        </div>
      </div>
    </div>
  );
}
