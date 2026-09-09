import { ShieldCheck, LockKeyhole, FileText } from 'lucide-react';

export const metadata = {
  title: 'Aviso de Privacidad | Chambitas',
  description: 'Conoce cómo protegemos tus datos y por qué solicitamos el INE para verificar perfiles.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          Aviso de Privacidad
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tu seguridad y confianza son lo más importante para nosotros. En Chambitas, tratamos tus datos con total transparencia y responsabilidad.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <LockKeyhole className="w-5 h-5 text-brand-primary" />
            1. Protección de tu Identidad (Uso del INE)
          </h2>
          <p className="mb-3">
            Para garantizar la seguridad de los clientes que contratan servicios a través de Chambitas, ofrecemos a los técnicos la opción de verificar su perfil subiendo una fotografía de su Identificación Oficial (INE).
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">¿Para qué usamos el INE?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Exclusivamente para validar que el nombre registrado coincida con el documento oficial.</li>
              <li>Otorgar la <strong>Insignia de Perfil Verificado</strong>, lo cual aumenta hasta en un 80% las probabilidades de ser contratado.</li>
              <li>Dar confianza a las familias y negocios que te van a abrir la puerta de su casa.</li>
            </ul>
          </div>
          <p className="text-sm font-semibold text-brand-primary bg-brand-primary/10 p-3 rounded-lg border border-brand-primary/20">
            Importante: Tu INE NO se publica, NO se comparte con terceros, y NO se elimina para mantener el registro de verificación vinculado a tu cuenta. Solo los administradores de Chambitas tienen acceso a este documento para fines de auditoría.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            2. Información que Recopilamos
          </h2>
          <p className="mb-2">
            Al registrarte en Chambitas, recopilamos la siguiente información estrictamente necesaria para que la plataforma funcione:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Nombre completo y número de WhatsApp (para que los clientes te contacten).</li>
            <li>Oficios, habilidades y fotos de tus trabajos (para tu portafolio).</li>
            <li>Ciudades y colonias de cobertura.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            3. Cookies y Rastreo
          </h2>
          <p>
            Utilizamos tecnologías como cookies únicamente para mantener tu sesión activa, recordar tus preferencias (como el modo oscuro) y medir estadísticas anónimas de visitas a los perfiles para que sepas cuánta gente está viendo tu tarjeta digital. No vendemos información a anunciantes externos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            4. Modificaciones a este Aviso
          </h2>
          <p>
            Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento. Los cambios importantes serán notificados a través de tu panel de control o por correo electrónico.
          </p>
        </section>

      </div>
    </div>
  );
}
