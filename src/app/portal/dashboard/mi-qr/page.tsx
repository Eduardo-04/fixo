'use client';

import QRCodeCard from '@/components/technician/QRCodeCard';
import { MOCK_TECHNICIANS } from '@/lib/mock-data';
import { Printer, Smartphone, Share2, Sparkles } from 'lucide-react';

export default function MyQRCodePage() {
  const tech = MOCK_TECHNICIANS[0];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          Mi Tarjeta Digital & Código QR
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Descarga e imprime tu tarjeta oficial Fixo para tus volantes, tarjetas de presentación o rótulos de tu vehículo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Renderizador de Tarjeta QR */}
        <div>
          <QRCodeCard
            slug={tech.slug}
            technicianName={tech.full_name}
            specialty={tech.categories?.[0]?.name || 'Técnico Especialista'}
            phone={tech.phone_whatsapp}
            emitsCfdi={tech.emits_cfdi}
            isVerified={tech.verification_status === 'verified'}
          />
        </div>

        {/* Consejos para Técnicos para Aumentar Ventas */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Cómo sacarle el máximo provecho</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-brand-primary flex items-center justify-center shrink-0 font-bold font-mono">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">Descarga la imagen en PNG</p>
                  <p className="text-slate-500 mt-0.5">
                    El botón genera un diseño listo en alta resolución con tu nombre, oficio, WhatsApp y código QR.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-brand-primary flex items-center justify-center shrink-0 font-bold font-mono">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800">Mándala a imprimir en imprenta local</p>
                  <p className="text-slate-500 mt-0.5">
                    Imprime 500 o 1,000 tarjetas de presentación o volantes para repartir en casas tras terminar una reparación.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-brand-primary flex items-center justify-center shrink-0 font-bold font-mono">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800">Pégala en tu estado de WhatsApp y Facebook</p>
                  <p className="text-slate-500 mt-0.5">
                    Comparte tu enlace canónico directo en grupos vecinales de Tuxtla Gutiérrez para captar clientes recomendados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-emerald-400">
              ✓ Garantía de Cero Comisiones Fixo
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cualquier persona que escanee tu código QR te mandará mensaje directo a tu WhatsApp personal sin intermediación ni retención de tu dinero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
