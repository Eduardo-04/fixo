'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Eye, FileText, User, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { approveOrRejectVerification } from '@/app/actions';

interface PendingDoc {
  profileId: string;
  technicianName: string;
  trade: string;
  submittedAt: string;
  frontUrl: string;
  backUrl: string;
  phone: string;
  frontId: string;
  backId: string;
}

export default function AdminVerificationsPage() {
  const [list, setList] = useState<PendingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPending() {
      const supabase = createClient();
      
      // Consultar perfiles que están en pending, y sus documentos
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          id, full_name, phone_whatsapp, created_at,
          technician_categories(categories(name)),
          verification_documents(*)
        `)
        .eq('verification_status', 'pending');

      if (profiles) {
        const mappedList: PendingDoc[] = [];
        
        profiles.forEach((p: any) => {
          const docs = p.verification_documents || [];
          const frontDoc = docs.find((d: any) => d.document_type === 'ine_front');
          const backDoc = docs.find((d: any) => d.document_type === 'ine_back');
          
          if (frontDoc && backDoc) {
            mappedList.push({
              profileId: p.id,
              technicianName: p.full_name,
              trade: p.technician_categories?.[0]?.categories?.name || 'Servicios',
              phone: p.phone_whatsapp,
              submittedAt: new Date(frontDoc.created_at).toLocaleString(),
              frontUrl: frontDoc.document_url,
              backUrl: backDoc.document_url,
              frontId: frontDoc.id,
              backId: backDoc.id
            });
          }
        });
        
        setList(mappedList);
      }
      setLoading(false);
    }
    loadPending();
  }, []);

  const handleAction = async (item: PendingDoc, action: 'approved' | 'rejected') => {
    const newStatus = action === 'approved' ? 'verified' : 'rejected';
    
    // Necesitamos llamar a la accion por ambos docs, o podemos hacer que la accion actualice todo por profile_id
    // pero por ahora actualizamos ambos y el profile
    await approveOrRejectVerification(item.frontId, item.profileId, newStatus);
    await approveOrRejectVerification(item.backId, item.profileId, newStatus);
    
    setList((prev) => prev.filter((doc) => doc.profileId !== item.profileId));
    setFeedback(action === 'approved' 
      ? `✓ ¡Credencial de ${item.technicianName} aprobada! La insignia verde ya está visible en su perfil.`
      : `✕ Se rechazó la verificación de ${item.technicianName}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-mono">
          Revisión de Identificaciones Oficiales (INE)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Valida que el nombre coincida y que la credencial esté vigente antes de conceder la insignia verde de verificación.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">¡Bandeja al día!</h3>
          <p className="text-xs text-slate-500">No hay documentos de verificación pendientes en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((item) => (
            <div
              key={item.profileId}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.technicianName}</h3>
                    <p className="text-xs font-semibold text-brand-primary">{item.trade}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.phone} • Enviado {item.submittedAt}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                    Pendiente
                  </span>
                </div>

                {/* Previews de INE */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Frente INE</span>
                    <div 
                      className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(item.frontUrl)}
                    >
                      <img src={item.frontUrl} alt="INE Frente" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Reverso INE</span>
                    <div 
                      className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(item.backUrl)}
                    >
                      <img src={item.backUrl} alt="INE Reverso" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Aprobación & Cumplimiento Legal */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction(item, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(item, 'approved')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aprobar INE</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <a
                    href="https://listanominal.ine.mx/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>↗ Consultar en Lista Nominal INE oficial</span>
                  </a>

                  <span className="text-[10px] text-slate-400">
                    Al aprobar se purgan las fotos por privacidad LFPDPPP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Visor de Imagen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 flex items-center gap-2 font-bold text-sm"
            >
              Cerrar <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedImage} 
              alt="Vista Expandida" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
