'use client';

import { useState, useEffect } from 'react';
import QRCodeCard from '@/components/technician/QRCodeCard';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MyQRCodePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Cargar perfil, categoría y trabajos realizados
        const { data } = await supabase
          .from('profiles')
          .select('*, technician_categories(categories(name)), portfolio_items(id)')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }
    
    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Cargando tarjeta digital...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-500 font-medium">No se encontró información del perfil. Por favor, asegúrate de haber guardado tus datos en la pestaña de Perfil.</div>;
  }

  // Extraer nombre de categoría (si tiene)
  const categoryName = profile.technician_categories?.[0]?.categories?.name || 'Técnico Especialista';

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
            slug={profile.slug}
            technicianName={profile.full_name}
            specialty={categoryName}
            phone={profile.phone_whatsapp}
            emitsCfdi={profile.emits_cfdi}
            isVerified={profile.verification_status === 'verified'}
            avatarUrl={profile.avatar_url}
            rating={profile.rating_average || 5.0}
            reviewsCount={profile.reviews_count || 0}
            jobsCount={profile.portfolio_items?.length || 0}
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
