import { FileText, Handshake, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones | Chambitas',
  description: 'Reglas de uso y condiciones de servicio para técnicos y usuarios de Chambitas.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mb-4">
          <Handshake className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Reglas claras para mantener una comunidad segura y profesional para todos.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            1. Naturaleza del Servicio
          </h2>
          <p>
            Chambitas actúa exclusivamente como un <strong>directorio digital y punto de contacto</strong> entre técnicos independientes y clientes que buscan servicios en el estado de Chiapas. 
          </p>
          <div className="mt-3 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-xl border border-orange-200 dark:border-orange-800/50 flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              Chambitas NO es empleador de los técnicos, NO retiene comisiones por los trabajos realizados, y NO se hace responsable de disputas comerciales, garantías o calidad de la mano de obra acordada entre el cliente y el técnico.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            2. Responsabilidades del Técnico
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>El técnico es responsable de brindar un trato respetuoso y profesional en todo momento.</li>
            <li>Debe asegurar que los trabajos subidos a su portafolio sean 100% reales y de su propia autoría.</li>
            <li>En caso de recibir múltiples reportes negativos o quejas comprobables por fraude o mala conducta, Chambitas se reserva el derecho de <strong>suspender o eliminar el perfil definitivamente</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            3. Proceso de Verificación y Perfil Verificado
          </h2>
          <p className="mb-2">
            Para ofrecer mayor seguridad a la comunidad, los técnicos pueden optar por subir su credencial de elector (INE):
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>La verificación del INE concede la insignia de "Perfil Verificado".</li>
            <li>Subir identificaciones falsas, alteradas o de terceros resultará en la eliminación inmediata de la cuenta.</li>
            <li>La insignia de "Verificado" certifica únicamente que la identidad registrada coincide con una identificación oficial; no es una garantía sobre la calidad del trabajo.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            4. Uso de la Tarjeta Digital
          </h2>
          <p>
            Los técnicos pueden compartir su Tarjeta Digital Fixo libremente mediante su enlace o código QR. Está prohibido usar la plataforma para promover servicios ilegales, estafas o negocios que no correspondan a oficios del hogar o mantenimiento.
          </p>
        </section>

      </div>
    </div>
  );
}
