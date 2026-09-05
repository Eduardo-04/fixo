'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/technician/ImageUploader';
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function VerificationPage() {
  const [frontDoc, setFrontDoc] = useState<File | null>(null);
  const [backDoc, setBackDoc] = useState<File | null>(null);
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingState, setIsLoadingState] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('verification_status')
          .eq('id', user.id)
          .single();
        if (profile) {
          setStatus(profile.verification_status || 'unverified');
        }
      }
      setIsLoadingState(false);
    }
    loadStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontDoc || !backDoc) return;
    
    setIsUploading(true);
    setErrorMsg('');
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autorizado');

      // 1. Subir frente a private-docs
      const frontPath = `${user.id}/ine_front_${Date.now()}.webp`;
      const { error: frontError } = await supabase.storage
        .from('private-docs')
        .upload(frontPath, frontDoc);
      if (frontError) throw frontError;
      
      const { data: frontUrlData } = await supabase.storage.from('private-docs').createSignedUrl(frontPath, 315360000); // 10 años

      // 2. Subir reverso a private-docs
      const backPath = `${user.id}/ine_back_${Date.now()}.webp`;
      const { error: backError } = await supabase.storage
        .from('private-docs')
        .upload(backPath, backDoc);
      if (backError) throw backError;
      
      const { data: backUrlData } = await supabase.storage.from('private-docs').createSignedUrl(backPath, 315360000);

      // 3. Insertar registros en verification_documents
      if (frontUrlData?.signedUrl) {
        await supabase.from('verification_documents').insert({
          profile_id: user.id,
          document_type: 'ine_front',
          document_url: frontUrlData.signedUrl,
        });
      }

      if (backUrlData?.signedUrl) {
        await supabase.from('verification_documents').insert({
          profile_id: user.id,
          document_type: 'ine_back',
          document_url: backUrlData.signedUrl,
        });
      }

      // Actualizar estado en profile a pending
      await supabase.from('profiles').update({ verification_status: 'pending' }).eq('id', user.id);

      setStatus('pending');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al enviar documentos: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingState) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

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

      {status === 'pending' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-mono">
            Documentos en Revisión
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Tu identificación está en estado <strong className="text-amber-600 font-bold">Pendiente de Aprobación</strong>. Nuestro equipo valida los documentos en un plazo promedio de 4 a 12 horas.
          </p>
        </div>
      ) : status === 'verified' ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 font-mono">
            ¡Identidad Verificada!
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Felicidades, tu cuenta ya cuenta con la insignia de confianza oficial. Ya apareces mejor posicionado en las búsquedas.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {status === 'rejected' && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Tus documentos anteriores fueron rechazados (ilegibles o datos incorrectos). Por favor sube fotografías claras nuevamente.</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
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

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="w-4 h-4" />
                <span>Revisión manual por personal local en Tuxtla Gutiérrez</span>
              </div>

              <button
                type="submit"
                disabled={!frontDoc || !backDoc || isUploading}
                className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-40 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? 'Subiendo Documentos...' : 'Enviar Documentos para Aprobación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
