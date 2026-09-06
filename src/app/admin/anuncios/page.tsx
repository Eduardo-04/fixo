'use client';

import { useState } from 'react';
import { Megaphone, Save, Loader2, Info } from 'lucide-react';
import { updateSystemAnnouncement } from './actions';

export default function AdminAnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Convertir el checkbox
    formData.set('is_active', formData.get('is_active') ? 'true' : 'false');

    const result = await updateSystemAnnouncement(formData);

    if (result.success) {
      setMessage('Anuncio guardado y publicado correctamente.');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
          Anuncios Globales
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Publica un banner destacado que aparecerá en el panel de control de todos los técnicos registrados.
        </p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Título del Anuncio
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ej. ¡Nueva función disponible!"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mensaje Principal
              </label>
              <textarea
                name="message"
                required
                rows={3}
                placeholder="Escribe el cuerpo del anuncio..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:border-brand-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Texto del Botón (Opcional)
                </label>
                <input
                  type="text"
                  name="link_text"
                  placeholder="Ej. Ver más"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Enlace / URL (Opcional)
                </label>
                <input
                  type="text"
                  name="link_url"
                  placeholder="Ej. https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tipo de Anuncio (Color)
              </label>
              <select
                name="type"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 focus:border-brand-primary"
              >
                <option value="info">Informativo (Azul)</option>
                <option value="success">Éxito / Nuevo (Verde)</option>
                <option value="warning">Advertencia (Naranja)</option>
                <option value="ad">Publicidad Pagada (Morado)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked
                className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Activar anuncio inmediatamente
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">
              Al guardar, se reemplazará y desactivará cualquier anuncio previo.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publicar Anuncio</span>
          </button>
        </form>
      </div>
    </div>
  );
}
