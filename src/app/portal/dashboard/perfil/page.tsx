'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Briefcase, FileCheck2, Check, AlertCircle } from 'lucide-react';
import { MOCK_TECHNICIANS } from '@/lib/mock-data';
import { updateTechnicianProfile } from '@/app/actions';

export default function EditProfilePage() {
  const tech = MOCK_TECHNICIANS[0];

  const [fullName, setFullName] = useState(tech.full_name);
  const [phone, setPhone] = useState(tech.phone_whatsapp);
  const [bio, setBio] = useState(tech.bio || '');
  const [experienceYears, setExperienceYears] = useState(tech.experience_years.toString());
  const [emitsCfdi, setEmitsCfdi] = useState(tech.emits_cfdi);
  const [neighborhoods, setNeighborhoods] = useState(tech.neighborhoods_covered.join(', '));
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('bio', bio);
    formData.append('experienceYears', experienceYears);
    formData.append('emitsCfdi', emitsCfdi.toString());
    formData.append('neighborhoods', neighborhoods);

    await updateTechnicianProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
          Mi Perfil y Zonas de Cobertura
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Actualiza tu información pública para que los clientes te contacten con confianza.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {saved && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Perfil actualizado exitosamente.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nombre Completo o Razón Social
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Teléfono WhatsApp (+52...)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Años de Experiencia
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Facturación (CFDI)
              </label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cfdiToggle"
                  checked={emitsCfdi}
                  onChange={(e) => setEmitsCfdi(e.target.checked)}
                  className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary h-5 w-5"
                />
                <label htmlFor="cfdiToggle" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Emite factura fiscal válida ante el SAT
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Colonias o Zonas de Cobertura (Separadas por comas)
            </label>
            <input
              type="text"
              value={neighborhoods}
              onChange={(e) => setNeighborhoods(e.target.value)}
              placeholder="Ej. Terán, Plan de Ayala, Las Palmas, Moctezuma"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Descripción de tus Servicios y Garantía (Bio)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detalla tus especialidades, tipos de equipos que reparas, refacciones originales..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
