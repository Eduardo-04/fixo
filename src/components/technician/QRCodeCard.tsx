'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Printer, Check, QrCode, Star } from 'lucide-react';
import { useState } from 'react';

interface QRCodeCardProps {
  slug: string;
  technicianName: string;
  specialty: string;
  phone: string;
  emitsCfdi?: boolean;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export default function QRCodeCard({
  slug,
  technicianName,
  specialty,
  phone,
  emitsCfdi = false,
  isVerified = false,
  rating = 0,
  reviewsCount = 0,
}: QRCodeCardProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // URL canónica del perfil
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fixo.com.mx';
  const profileUrl = `${baseUrl}/t/${slug}`;

  // Descarga del canvas como imagen PNG
  const handleDownloadQR = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Crear un canvas compuesto estilizado tipo tarjeta para imprimir
    const compositeCanvas = document.createElement('canvas');
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;

    // Dimensiones de tarjeta de bolsillo (800 x 1200 px para alta definición)
    compositeCanvas.width = 800;
    compositeCanvas.height = 1100;

    // Fondo
    ctx.fillStyle = '#0F172A'; // Slate 900
    ctx.fillRect(0, 0, 800, 1100);

    // Cabecera Fixo
    ctx.fillStyle = '#EA580C'; // Primary Amber
    ctx.fillRect(0, 0, 800, 24);

    // Logo texto
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FIXO.', 400, 110);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText('La red de tus mejores chambas', 400, 150);

    // Contenedor blanco para el QR
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(100, 190, 600, 600, 32);
    ctx.fill();

    // Dibujar el QR en el centro
    ctx.drawImage(canvas, 150, 240, 500, 500);

    // Datos del Técnico
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText(technicianName, 400, 850);

    ctx.fillStyle = '#EA580C';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.fillText(specialty, 400, 900);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(`WhatsApp: ${phone}`, 400, 950);

    // Dibujar Calificación si existe
    if (rating > 0) {
      ctx.fillStyle = '#FBBF24'; // amber-400
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText(`★ ${rating.toFixed(1)} (${reviewsCount} reseñas)`, 400, 1000);
    }

    // Pie con llamado a la acción
    ctx.fillStyle = '#10B981';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('✓ Escanea con tu celular para ver mis trabajos y contactarme', 400, 1050);

    const link = document.createElement('a');
    link.download = `Fixo-Tarjeta-QR-${slug}.png`;
    link.href = compositeCanvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-brand-base text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Detalle visual superior */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Tarjeta Digital & QR</h3>
            <p className="text-[11px] text-slate-400">Escaneo directo con cámara móvil</p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-md border border-brand-primary/30">
          Oficial Fixo
        </span>
      </div>

      {/* Contenedor del QR Canvas */}
      <div className="flex flex-col items-center justify-center">
        <div
          ref={canvasRef}
          className="p-4 bg-white rounded-2xl shadow-xl border-4 border-slate-800/80 mb-4"
        >
          <QRCodeCanvas
            value={profileUrl}
            size={220}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/favicon.ico',
              x: undefined,
              y: undefined,
              height: 38,
              width: 38,
              excavate: true,
            }}
          />
        </div>

        {/* Reputación del Técnico */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({reviewsCount} reseñas verificadas)</span>
          </div>
        )}

        <p className="text-xs text-slate-300 font-medium text-center mb-6 max-w-xs">
          Escanea aquí para ver mi portafolio verificado, cobertura y contactarme al instante.
        </p>

        {/* Acciones del QR */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Tarjeta (PNG)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-3 px-4 rounded-xl border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
