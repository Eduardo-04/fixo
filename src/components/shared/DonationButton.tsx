'use client';

import { Heart } from 'lucide-react';

export default function DonationButton() {
  const handleDonate = (amount: number) => {
    let url = '';
    if (amount === 10) url = 'https://mpago.la/2BdgXYD';
    if (amount === 50) url = 'https://mpago.la/2vqDA4e';
    if (amount === 100) url = 'https://mpago.la/2PbftLG';
    
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:bg-slate-800/60 transition-colors">
      <div className="flex-1 max-w-2xl text-center md:text-left">
        <h4 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>Apoya a Chambitas y ayúdanos a crecer</span>
        </h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          ¿Nuestra plataforma te ayudó a encontrar al técnico ideal o a conseguir un nuevo cliente hoy? Ayúdanos a mantener la plataforma viva y <strong>siempre libre de comisiones</strong> invitándonos un café.
        </p>
      </div>
      <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elige tu aporte (Mercado Pago):</span>
        <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50">
          {[10, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => handleDonate(amount)}
              className="flex-1 min-w-[75px] flex items-center justify-center bg-slate-800 hover:bg-brand-primary text-slate-300 hover:text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-slate-700 hover:border-brand-primary-hover hover:shadow-brand-primary/25 hover:-translate-y-0.5"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
