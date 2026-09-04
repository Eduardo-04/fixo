'use client';

import { useState } from 'react';
import ImageUploader from '@/components/technician/ImageUploader';
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, FileText } from 'lucide-react';

export default function VerificationPage() {
  const [frontDoc, setFrontDoc] = useState<File | null>(null);
  const [backDoc, setBackDoc] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontDoc || !backDoc) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          Verificación de Identidad Oficial (INE)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Obtén la insignia oficial de <strong className="text-emerald-600">✓ Identidad Verificada</strong> en tu perfil para generar mayor confianza y aparecer en los primeros lugares de búsqueda en Tuxtla Gutiérrez.
        </p>
      </div>

      {/* Tarjeta de Privacidad y Seguridad */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs text-emerald-900 space-y-1">
          <p className="font-bold">Tus documentos están 100% protegidos y privados</p>
          <p className="text-emerald-700 leading-relaxed">
            Se almacenan en un bucket privado de Supabase (`private-docs`). Solo el equipo de administración de Fixo tiene acceso para validar tu identidad. Jamás se compartirán de forma pública.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-mono">
            Documentos Enviados a Revisión
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Tu identificación está en estado <strong className="text-amber-600 font-bold">Pendiente de Aprobación</strong>. Nuestro equipo en Chiapas valida los documentos en un plazo promedio de 4 a 12 horas.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span>Te notificaremos en cuanto tu insignia esté activa.</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploader
                label="Frente de la Credencial (INE / IFE)"
                sublabel="Asegúrate de que la foto, nombre y folio sean legibles."
                onFileReady={(file) => setFrontDoc(file)}
              />

              <ImageUploader
                label="Reverso de la Credencial"
                sublabel="Debe verse la firma y las líneas de captura ópticas."
                onFileReady={(file) => setBackDoc(file)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="w-4 h-4" />
                <span>Revisión manual por personal local en Tuxtla Gutiérrez</span>
              </div>

              <button
                type="submit"
                disabled={!frontDoc || !backDoc}
                className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Enviar Documentos para Aprobación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
