'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada
    const mqStandAlone = '(display-mode: standalone)';
    if ((window.navigator as any).standalone || window.matchMedia(mqStandAlone).matches) {
      setIsStandalone(true);
      return;
    }

    // Detectar iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Si es iOS, se muestra siempre si no está en standalone
    if (isIOSDevice) setShowPrompt(true);

    // Manejar evento de instalación en Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setInstallPrompt(null);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-80 bg-brand-base border border-slate-700 p-4 rounded-2xl shadow-2xl z-[100] flex flex-col gap-3 text-white animate-in slide-in-from-bottom-5">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Instala Chambitas App</h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-tight">
            Accede más rápido al directorio sin gastar tantos datos.
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="text-[11px] bg-slate-800/80 p-2 rounded-lg text-slate-300">
          En tu iPhone, toca el botón de <strong>Compartir</strong> y selecciona <strong>"Agregar a Inicio"</strong>.
        </div>
      ) : (
        <button 
          onClick={handleInstallClick}
          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          Instalar Ahora
        </button>
      )}
    </div>
  );
}
