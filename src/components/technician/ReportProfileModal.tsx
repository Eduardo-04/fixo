'use client';

import { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { submitProfileReport } from '@/app/actions';

interface ReportProfileModalProps {
  profileId: string;
}

export default function ReportProfileModal({ profileId }: ReportProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setErrorMsg('Por favor selecciona una razón.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    const res = await submitProfileReport(profileId, reason, details, contactEmail);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || 'Error al enviar reporte.');
    }
    setIsSubmitting(false);
  };

  const closeAndReset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      setReason('');
      setDetails('');
      setContactEmail('');
      setErrorMsg('');
    }, 300);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-8 py-3 text-[11px] font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Reportar perfil o problema</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeAndReset}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Flag className="w-4 h-4 text-red-500" />
                <h2>Reportar Técnico</h2>
              </div>
              <button 
                onClick={closeAndReset}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {isSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reporte Enviado</h3>
                  <p className="text-sm text-slate-500">
                    Gracias por ayudarnos a mantener la comunidad segura. Revisaremos este perfil lo antes posible.
                  </p>
                  <button 
                    onClick={closeAndReset}
                    className="mt-4 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      <strong>Nota importante:</strong> Chambitas no procesa pagos y no puede ofrecer reembolsos. Analizamos cada reporte para suspender o eliminar técnicos fraudulentos de la plataforma.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Razón del reporte <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                      required
                    >
                      <option value="">Selecciona una opción...</option>
                      <option value="estafa">Sospecha de estafa o robo</option>
                      <option value="mal_trabajo">Trabajo de muy mala calidad</option>
                      <option value="no_se_presento">No se presentó a la cita acordada</option>
                      <option value="perfil_falso">Perfil o fotos falsas</option>
                      <option value="conducta_inapropiada">Conducta inapropiada / Falta de respeto</option>
                      <option value="otro">Otro motivo</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Detalles de lo sucedido
                    </label>
                    <textarea 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Explica brevemente qué ocurrió..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tu Correo (Opcional, para seguimiento)
                    </label>
                    <input 
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-primary dark:hover:bg-brand-primary-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Enviar Reporte Confidencial</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
