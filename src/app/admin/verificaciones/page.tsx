'use client';

import { useState } from 'react';
import { ShieldCheck, Check, X, Eye, FileText, User } from 'lucide-react';

import { approveOrRejectVerification } from '@/app/actions';

interface PendingDoc {
  id: string;
  profileId: string;
  technicianName: string;
  trade: string;
  submittedAt: string;
  frontUrl: string;
  backUrl: string;
  phone: string;
}

const INITIAL_PENDING: PendingDoc[] = [
  {
    id: 'doc-1',
    profileId: 'f1a23b45-3333-4000-8000-000000000003',
    technicianName: 'Manuel Alejandro Ruiz',
    trade: 'Electricidad Residencial',
    submittedAt: 'Hoy a las 10:30 AM',
    frontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    backUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    phone: '+529615551234',
  },
  {
    id: 'doc-2',
    profileId: 'f1a23b45-4444-4000-8000-000000000004',
    technicianName: 'Armando Castillejos Díaz',
    trade: 'Carpintería de Cedro',
    submittedAt: 'Ayer a las 04:15 PM',
    frontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    backUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    phone: '+529613334455',
  },
];

export default function AdminVerificationsPage() {
  const [list, setList] = useState<PendingDoc[]>(INITIAL_PENDING);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (item: PendingDoc, action: 'approved' | 'rejected') => {
    const newStatus = action === 'approved' ? 'verified' : 'rejected';
    await approveOrRejectVerification(item.id, item.profileId, newStatus);
    setList((prev) => prev.filter((doc) => doc.id !== item.id));
    setFeedback(action === 'approved' 
      ? `✓ ¡Credencial de ${item.technicianName} aprobada! La insignia verde ya está visible en su perfil.`
      : `✕ Se rechazó la verificación de ${item.technicianName}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

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
              key={item.id}
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
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={item.frontUrl} alt="INE Frente" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Reverso INE</span>
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
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
    </div>
  );
}
