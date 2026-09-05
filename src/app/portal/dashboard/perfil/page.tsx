'use client';

import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Briefcase, FileCheck2, Check, AlertCircle } from 'lucide-react';
import { updateTechnicianProfile } from '@/app/actions';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/technician/ImageUploader';
import Image from 'next/image';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Perfil
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('1');
  const [emitsCfdi, setEmitsCfdi] = useState(false);
  const [neighborhoods, setNeighborhoods] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrlPreview, setAvatarUrlPreview] = useState<string | null>(null);
  
  // Categorías
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // Cargar todas las categorías
      const { data: cats } = await supabase.from('categories').select('id, name, slug');
      if (cats) {
        // Ordenar alfabéticamente pero dejando "Otros Servicios" al final
        const sortedCats = cats.sort((a, b) => {
          if (a.slug === 'otros-servicios') return 1;
          if (b.slug === 'otros-servicios') return -1;
          return a.name.localeCompare(b.name);
        });
        setCategories(sortedCats);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        // Cargar perfil y su categoría principal
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, technician_categories(category_id)')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setFullName(profile.full_name || '');
          setPhone(profile.phone_whatsapp || '');
          setBio(profile.bio || '');
          setExperienceYears((profile.experience_years || 1).toString());
          setEmitsCfdi(profile.emits_cfdi || false);
          setNeighborhoods((profile.neighborhoods_covered || []).join(', '));
          setAvatarUrlPreview(profile.avatar_url || null);
          
          if (profile.technician_categories && profile.technician_categories.length > 0) {
            setSelectedCategoryId(profile.technician_categories[0].category_id.toString());
          }
        }
      }
      setLoading(false);
    }
    
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      let finalAvatarUrl = avatarUrlPreview;

      // Si hay una nueva imagen de avatar, la subimos
      if (avatarFile) {
        const avatarPath = `${userId}/avatar_${Date.now()}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public-media')
          .upload(avatarPath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;
        
        finalAvatarUrl = supabase.storage.from('public-media').getPublicUrl(avatarPath).data.publicUrl;
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('bio', bio);
      formData.append('experienceYears', experienceYears);
      formData.append('emitsCfdi', emitsCfdi.toString());
      formData.append('neighborhoods', neighborhoods);
      if (finalAvatarUrl) formData.append('avatarUrl', finalAvatarUrl);
      if (selectedCategoryId) formData.append('categoryId', selectedCategoryId);

      await updateTechnicianProfile(formData);
      
      setAvatarUrlPreview(finalAvatarUrl);
      setAvatarFile(null);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error al guardar el perfil:', err);
      alert('Hubo un error guardando tu perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Cargando perfil...</div>;
  }

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
          
          {/* FOTO DE PERFIL */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              {avatarUrlPreview ? (
                <Image src={avatarUrlPreview} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Foto de Perfil (Opcional)
              </label>
              <ImageUploader 
                label="Subir nueva foto"
                onFileReady={(file) => {
                  setAvatarFile(file);
                  setAvatarUrlPreview(URL.createObjectURL(file));
                }}
              />
              <p className="text-[10px] text-slate-400 mt-2">
                Sube una foto clara de tu rostro o el logo de tu negocio.
              </p>
            </div>
          </div>

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
                Especialidad / Oficio Principal
              </label>
              <select
                required
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-brand-primary focus:ring-brand-primary"
              >
                <option value="" disabled>-- Selecciona un oficio --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
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
            
            <div className="sm:col-span-2">
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
              disabled={isSaving}
              className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
